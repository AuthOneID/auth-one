import Application from '#models/application'
import { base64 } from '@adonisjs/core/helpers'
import stringHelpers from '@adonisjs/core/helpers/string'
import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import cache from '@adonisjs/cache/services/main'
import User from '#models/user'
import { signAuthToken } from '../lib/jwt.js'
import { JWTPayload } from 'jose'
import env from '#start/env'
import crypto from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { Infer } from '@vinejs/vine/types'
import serviceApp from '@adonisjs/core/services/app'

const schema = vine.object({
  response_type: vine.enum(['code']),
  client_id: vine.string().minLength(1).maxLength(100),
  redirect_uri: vine.string().url({ require_tld: false }).maxLength(256),
  state: vine.string().maxLength(256).optional(),
})
const validator = vine.compile(schema)

const oauthTokenSchema = vine.object({
  grant_type: vine.enum(['authorization_code', 'refresh_token']),
  client_id: vine.string().minLength(1).maxLength(100),
  client_secret: vine.string().minLength(1).maxLength(200),

  // Code grant specific
  redirect_uri: vine
    .string()
    .url({ require_tld: false })
    .maxLength(256)
    .optional()
    .requiredWhen('grant_type', '=', 'authorization_code'),
  code: vine
    .string()
    .minLength(1)
    .maxLength(256)
    .optional()
    .requiredWhen('grant_type', '=', 'authorization_code'),

  // Refresh token grant specific
  refresh_token: vine
    .string()
    .minLength(1)
    .maxLength(256)
    .optional()
    .requiredWhen('grant_type', '=', 'refresh_token'),
})
const oauthTokenValidator = vine.compile(oauthTokenSchema)

const generateTokenResponseData = async (
  user: User,
  clientId: string,
  host: string | null,
  generateRefreshToken?: boolean
) => {
  const idTokenPayload: JWTPayload = {
    name: user.fullName,
    username: user.username,
    email: user.email,
  }

  const accessTokenPayload: JWTPayload = {
    name: user.fullName,
    username: user.username,
    email: user.email,
    groups: user.groups.map((g) => g.name).join(','),
    roles: user.roles.map((r) => r.name).join(','),
    applications: user.applications.map((a) => a.name).join(','),
  }
  const refreshToken = generateRefreshToken ? stringHelpers.generateRandom(120) : undefined
  const hashedRefreshToken = refreshToken
    ? crypto.createHmac('sha256', env.get('APP_KEY')).update(refreshToken).digest('hex')
    : undefined

  if (hashedRefreshToken) {
    await cache.set({
      key: `refreshToken:${hashedRefreshToken}`,
      value: {
        user_id: user.id,
        client_id: clientId,
      },
      ttl: '14d',
    })
  }

  const responseData = {
    id_token: await signAuthToken(idTokenPayload, {
      expiry: '1h',
      audience: clientId,
      issuer: host ?? 'AuthOne',
      subject: user.id,
    }),
    access_token: await signAuthToken(accessTokenPayload, {
      expiry: '1h',
      audience: clientId,
      issuer: host ?? 'AuthOne',
      subject: user.id,
    }),
    scope: 'openid profile',
    expires_in: 60 * 60,
    token_type: 'Bearer',
    refresh_token: refreshToken,
  }

  return responseData
}

export default class AuthorizesController {
  public async authorize({ response, auth, request }: HttpContext) {
    const [error, validated] = await validator.tryValidate(request.all())
    if (error?.messages[0]?.message) {
      return response.unprocessableEntity(error?.messages[0]?.message)
    }

    if (!auth.user) {
      return response.redirect(`/login?redirect=${base64.urlEncode(request.url(true))}`)
    }

    await auth.user.load('applications', (q) => q.select('id'))
    await auth.user.load('groups', (q) => q.select('id'))
    await auth.user.load('roles', (q) => q.select('id'))

    const app = await Application.query()
      .where('client_id', validated?.client_id || '')
      .preload('roles', (q) => q.select('id'))
      .preload('groups', (q) => q.select('id'))
      .preload('users', (q) => q.select('id'))
      .first()
    if (!app) {
      return response.unauthorized('You do not have access to this application.')
    }

    const appUserIds = app.users.map((u) => u.id)
    const appGroupIds = app.groups.map((g) => g.id)
    const appRoleIds = app.roles.map((r) => r.id)

    const userGroupIds = auth.user.groups.map((g) => g.id)
    const userRoleIds = auth.user.roles.map((r) => r.id)

    const isAllowed =
      appUserIds.includes(auth.user.id) ||
      appGroupIds.some((id) => userGroupIds.includes(id)) ||
      appRoleIds.some((id) => userRoleIds.includes(id))

    if (!isAllowed) {
      return response.unauthorized('You do not have access to this application.')
    }

    const redeemCode = stringHelpers.generateRandom(120)
    await cache.set({
      key: `redeemCode:${redeemCode}`,
      value: {
        code: redeemCode,
        client_id: validated?.client_id,
        user_id: auth.user.id,
        redirect_uri: validated?.redirect_uri,
      },
      ttl: '60s',
    })

    return response.redirect(
      `${validated?.redirect_uri}?code=${redeemCode}&state=${validated?.state || ''}`
    )
  }

  public async oauthToken({ response, request }: HttpContext) {
    const [error, validated] = await oauthTokenValidator.tryValidate(request.all())
    if (error?.messages[0]?.message) {
      return response.unprocessableEntity(error?.messages[0]?.message)
    }

    if (validated?.grant_type === 'authorization_code') {
      return await this.authCode(validated!, response, request)
    }

    if (validated?.grant_type === 'refresh_token') {
      return await this.refreshToken(validated!, response, request)
    }

    return response.badRequest({ error: 'Unsupported grant_type' })
  }

  private async authCode(
    validated: Infer<typeof oauthTokenSchema>,
    response: HttpContext['response'],
    request: HttpContext['request']
  ) {
    const data = await cache.get<{
      code: string
      client_id: string
      user_id: string
      redirect_uri: string
    }>({ key: `redeemCode:${validated!.code}` })
    if (!data) {
      return response.unauthorized({ error: 'Invalid or expired authorization code.' })
    }

    const user = await User.query()
      .where('id', data.user_id)
      .where('isActive', true)
      .preload('applications', (q) => q.select('name'))
      .preload('groups', (q) => q.select('name'))
      .preload('roles', (q) => q.select('name'))
      .first()
    if (!user) {
      return response.unauthorized({ error: 'User not found.' })
    }

    await cache.delete({ key: `redeemCode:${validated!.code}` })

    return response.json(
      await generateTokenResponseData(user, data.client_id, request.host(), true)
    )
  }

  private async refreshToken(
    validated: Infer<typeof oauthTokenSchema>,
    response: HttpContext['response'],
    request: HttpContext['request']
  ) {
    const hashedRefreshToken = crypto
      .createHmac('sha256', env.get('APP_KEY'))
      .update(validated.refresh_token!)
      .digest('hex')
    const data = await cache.get<{
      user_id: string
      client_id: string
    }>({ key: `refreshToken:${hashedRefreshToken}` })

    if (!data) {
      return response.unauthorized({ error: 'Invalid or expired refresh token.' })
    }

    if (data.client_id !== validated!.client_id) {
      return response.unauthorized({ error: 'Client ID mismatch.' })
    }

    const user = await User.query()
      .where('id', data.user_id)
      .where('isActive', true)
      .preload('applications', (q) => q.select('name'))
      .preload('groups', (q) => q.select('name'))
      .preload('roles', (q) => q.select('name'))
      .first()

    if (!user) {
      await cache.delete({ key: `refreshToken:${hashedRefreshToken}` })
      return response.unauthorized({ error: 'User not found or inactive.' })
    }

    return response.json(await generateTokenResponseData(user, data.client_id, request.host()))
  }

  /**
   * GET /.well-known/jwks.json
   * Returns the JSON Web Key Set (JWKS) for token verification
   */
  public async getJwks({ response }: HttpContext) {
    try {
      const jwkContent = await readFile(serviceApp.makePath('storage/keys/public.jwk.json'), 'utf8')
      const jwk = JSON.parse(jwkContent)

      // Add 'use' and 'alg' fields for better OIDC compliance
      const jwks = {
        keys: [
          {
            ...jwk,
            use: 'sig', // This key is used for signature verification
            alg: 'EdDSA', // Algorithm used
          },
        ],
      }

      return response.json(jwks)
    } catch (error) {
      return response.internalServerError({ error: 'Failed to load JWKS' })
    }
  }

  /**
   * GET /.well-known/openid-configuration
   * Returns the OpenID Connect Discovery document
   */
  public async getOpenidConfig({ request, response }: HttpContext) {
    const baseUrl = `${request.protocol()}://${request.host()}`

    const config = {
      issuer: baseUrl,
      authorization_endpoint: `${baseUrl}/authorize`,
      token_endpoint: `${baseUrl}/oauth/token`,
      jwks_uri: `${baseUrl}/.well-known/jwks.json`,
      response_types_supported: ['code'],
      grant_types_supported: ['authorization_code', 'refresh_token'],
      subject_types_supported: ['public'],
      id_token_signing_alg_values_supported: ['EdDSA'],
      scopes_supported: ['openid', 'profile'],
      token_endpoint_auth_methods_supported: ['client_secret_post'],
      claims_supported: ['sub', 'name', 'iss', 'aud', 'exp', 'iat'],
    }

    return response.json(config)
  }
}

// http://localhost:3333/authorize?response_type=code&client_id=wl8N3gilFVyo8rskowUTBEbxuxM59YI5&redirect_uri=http://localhost:5173/instansi/auth
