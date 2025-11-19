import User from '#models/user'
import { base64 } from '@adonisjs/core/helpers'
import type { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'
import vine, { errors } from '@vinejs/vine'

const schema = vine.object({
  username: vine.string().minLength(1).maxLength(254),
  password: vine.string().minLength(1).maxLength(100),
})
const validator = vine.compile(schema)

const normalizeBcrypt = (h: string) => {
  if (h.startsWith('$2y$')) {
    return '$2b$' + h.substring(4)
  }
  return h
}

export default class LoginController {
  public async show({ inertia }: HttpContext) {
    return inertia.render('login/index')
  }

  private async handleAuthSuccess(user: User, { request, response, auth, inertia }: HttpContext) {
    await auth.use('web').login(user)

    const redirect = request.input('redirect')
    if (redirect) {
      return inertia.location(base64.urlDecode(redirect) || '/')
    }

    return response.redirect('/apps')
  }

  public async store(ctx: HttpContext) {
    const { request } = ctx
    const { username, password } = await validator.validate(request.all())

    const user = await User.query()
      .where((q) => q.where('username', username).orWhere('email', username))
      .preload('applications')
      .preload('roles')
      .preload('groups')
      .first()

    if (!user) {
      throw new errors.E_VALIDATION_ERROR([
        {
          field: 'message',
          message: 'Invalid user credentials',
        },
      ])
    }

    if (user.password.includes('scrypt')) {
      const isPasswordValid = await hash.use('scrypt').verify(user.password, password)
      if (isPasswordValid) {
        return this.handleAuthSuccess(user, ctx)
      }

      throw new errors.E_VALIDATION_ERROR([
        {
          field: 'message',
          message: 'Invalid user credentials',
        },
      ])
    }

    const isArgonValid = await hash.use('argon').verify(user.password, password)
    if (isArgonValid) {
      return this.handleAuthSuccess(user, ctx)
    }

    const isBcryptValid = await hash.use('bcrypt').verify(normalizeBcrypt(user.password), password)
    if (isBcryptValid) {
      return this.handleAuthSuccess(user, ctx)
    }

    throw new errors.E_VALIDATION_ERROR([
      {
        field: 'message',
        message: 'Invalid user credentials',
      },
    ])
  }

  public async logout({ response, auth }: HttpContext) {
    await auth.use('web').logout()
    return response.redirect('/login')
  }

  public async showLogout({ inertia }: HttpContext) {
    return inertia.render('logout/index')
  }
}
