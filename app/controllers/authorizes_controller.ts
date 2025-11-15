import Application from '#models/application'
import { base64 } from '@adonisjs/core/helpers'
import stringHelpers from '@adonisjs/core/helpers/string'
import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import cache from '@adonisjs/cache/services/main'
import User from '#models/user'
import { signIdToken } from '../lib/jwt.js'
import { JWTPayload } from 'jose'
import env from '#start/env'
import crypto from 'node:crypto'

const schema = vine.object({
  response_type: vine.enum(['code']),
  client_id: vine.string().minLength(1).maxLength(100),
  redirect_uri: vine.string().url({ require_tld: false }).maxLength(256),
  state: vine.string().maxLength(256).optional(),
})
const validator = vine.compile(schema)

const oauthTokenSchema = vine.object({
  code: vine.string().minLength(1).maxLength(256),
  grant_type: vine.enum(['authorization_code']),
  client_id: vine.string().minLength(1).maxLength(100),
  client_secret: vine.string().minLength(1).maxLength(200),
  redirect_uri: vine.string().url({ require_tld: false }).maxLength(256),
})
const oauthTokenValidator = vine.compile(oauthTokenSchema)

const refreshTokenSchema = vine.object({
  refresh_token: vine.string().minLength(1).maxLength(256),
  client_id: vine.string().minLength(1).maxLength(256),
  grant_type: vine.enum(['refresh_token']),
})
const refreshTokenValidator = vine.compile(refreshTokenSchema)

const generateTokenResponseData = async (
  user: User,
  clientId: string,
  host: string | null,
  generateRefreshToken?: boolean
) => {
  const idTokenPayload: JWTPayload = {
    name: user.fullName,
  }

  const accessTokenPayload: JWTPayload = {
    name: user.fullName,
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
    id_token: await signIdToken(idTokenPayload, {
      expiry: '1h',
      audience: clientId,
      issuer: host ?? 'AuthOne',
      subject: user.id,
    }),
    access_token: await signIdToken(accessTokenPayload, {
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

  public async refreshToken({ response, request }: HttpContext) {
    const [error, validated] = await refreshTokenValidator.tryValidate(request.all())
    if (error?.messages[0]?.message) {
      return response.unprocessableEntity(error?.messages[0]?.message)
    }

    const hashedRefreshToken = crypto
      .createHmac('sha256', env.get('APP_KEY'))
      .update(validated!.refresh_token)
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
}

// http://localhost:3333/authorize?response_type=code&client_id=wl8N3gilFVyo8rskowUTBEbxuxM59YI5&redirect_uri=http://localhost:5173/instansi/auth
