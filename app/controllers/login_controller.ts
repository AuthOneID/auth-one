import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'

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
    const user = await User.verifyCredentials(username, password)

    console.log('user', user)

    await auth.use('web').login(user)

    response.redirect('/dashboard')
  }
}
