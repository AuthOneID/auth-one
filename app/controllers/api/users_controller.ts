import { type HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import vine, { SimpleMessagesProvider } from '@vinejs/vine'
import User from '#models/user'
import { pick } from 'lodash-es'

vine.messagesProvider = new SimpleMessagesProvider(
  {
    'required': '{{ field }} field is required',
    'username.required': 'Username or email is required',
  },
  {}
)

const schema = vine.object({
  name: vine.string().minLength(1).maxLength(254),
  username: vine.string().maxLength(254).optional(),
  email: vine.string().email().maxLength(254).optional(),
  isActive: vine.boolean().optional(),
})

const createValidator = vine.compile(
  vine.object({
    ...schema.getProperties(),
    username: vine.string().maxLength(254).optional().requiredIfMissing('email'),
    password: vine.string().minLength(8).optional(),
    raw_password: vine.string().optional(),
  })
)

const updateValidator = vine.compile(
  vine.object({
    ...schema.getProperties(),
    password: vine.string().minLength(8).optional(),
    raw_password: vine.string().optional(),
  })
)

export default class ApiUsersController {
  public async show({ params }: HttpContext) {
    const [err] = await vine.tryValidate({ schema: vine.string().uuid(), data: params.id })
    const user = err
      ? await User.query().where('username', params.id).orWhere('email', params.id).firstOrFail()
      : await User.findOrFail(params.id)

    return user
  }

  public async store({ response, request }: HttpContext) {
    const validated = await createValidator.validate(request.all())

    const user = await User.create({
      fullName: validated.name,
      email: validated.email,
      username: validated.username,
      password: validated.password,
      isActive: validated.isActive ?? true,
    })

    if (validated.raw_password) {
      await db.from('users').where('id', user.id).update({ password: validated.raw_password })
    }

    return response.ok(user.serializeAttributes(['id', 'fullName', 'username', 'email']))
  }

  public async update({ response, request, params }: HttpContext) {
    const validated = await updateValidator.validate(request.all())

    const user = await User.findOrFail(params.id)
    const updateData: any = pick(validated, ['name', 'email', 'username', 'isActive'])

    if (validated.password) {
      updateData.password = validated.password
    } else if (validated.raw_password) {
      await db.from('users').where('id', user.id).update({ password: validated.raw_password })
    }

    await user.merge(updateData).save()

    return response.ok(user.serializeAttributes(['id', 'fullName', 'username', 'email']))
  }
}
