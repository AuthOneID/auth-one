import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'
import vine, { errors } from '@vinejs/vine'

const schema = vine.object({
  username: vine.string().minLength(1).maxLength(254),
  password: vine.string().minLength(1).maxLength(100),
})
const validator = vine.compile(schema)

export default class LoginController {
  public async show({ inertia }: HttpContext) {
    return inertia.render('login/index')
  }

  public async store({ request, response, auth }: HttpContext) {
    const { username, password } = await validator.validate(request.all())

    const user = await User.findBy('username', username)
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
        await auth.use('web').login(user, true)
        response.redirect('/dashboard')
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
      await auth.use('web').login(user, true)
      response.redirect('/dashboard')
    }

    const isBcryptValid = await hash.use('bcrypt').verify(user.password, password)
    if (isBcryptValid) {
      await auth.use('web').login(user, true)
      response.redirect('/dashboard')
    }

    throw new errors.E_VALIDATION_ERROR([
      {
        field: 'message',
        message: 'Invalid user credentials',
      },
    ])
  }
}
