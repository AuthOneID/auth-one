import Application from '#models/application'
import { base64 } from '@adonisjs/core/helpers'
import stringHelpers from '@adonisjs/core/helpers/string'
import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import cache from '@adonisjs/cache/services/main'

const schema = vine.object({
  response_type: vine.enum(['code']),
  client_id: vine.string().minLength(1).maxLength(100),
  redirect_uri: vine.string().url({ require_tld: false }).maxLength(256),
  state: vine.string().maxLength(256).optional(),
})
const validator = vine.compile(schema)

export default class AuthorizesController {
  public async authorize({ response, auth, request, params }: HttpContext) {
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

    const randomCode = stringHelpers.generateRandom(120)
    cache.set({ key: randomCode, value: auth.user.id, ttl: '60s' })

    return response.redirect(
      `${validated?.redirect_uri}?code=${randomCode}&state=${validated?.state || ''}`
    )
  }
}
