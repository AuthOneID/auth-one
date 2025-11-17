import { type HttpContext } from '@adonisjs/core/http'
import vine, { SimpleMessagesProvider } from '@vinejs/vine'
import User from '#models/user'

vine.messagesProvider = new SimpleMessagesProvider(
  {
    'required': '{{ field }} field is required',
    'username.required': 'Username or email is required',
  },
  {}
)

const schema = vine.object({
  name: vine.string().minLength(1).maxLength(254),
  username: vine.string().maxLength(254).optional().requiredIfMissing('email'),
  email: vine.string().email().maxLength(254).optional(),
  isActive: vine.boolean().optional(),
  groupIds: vine
    .array(vine.string().uuid())
    .parse((x) => (Array.isArray(x) ? x.filter(Boolean) : []))
    .optional(),
  roleIds: vine
    .array(vine.string().uuid())
    .parse((x) => (Array.isArray(x) ? x.filter(Boolean) : []))
    .optional(),
  applicationIds: vine
    .array(vine.string().uuid())
    .parse((x) => (Array.isArray(x) ? x.filter(Boolean) : []))
    .optional(),
})

const updateValidator = vine.compile(
  vine.object({
    ...schema.getProperties(),
    password: vine
      .string()
      .minLength(8)
      .confirmed({
        confirmationField: 'passwordConfirmation',
      })
      .optional(),
  })
)

export default class ApiUsersController {
  public async update({ response, request, params }: HttpContext) {
    const validated = await updateValidator.validate(request.all())

    const user = await User.findOrFail(params.id)
    const updateData: any = {
      fullName: validated.name,
      email: validated.email,
      username: validated.username,
      isActive: validated.isActive ?? true,
    }

    // Only update password if provided
    if (validated.password) {
      updateData.password = validated.password
    }

    await user.merge(updateData).save()

    if (validated.groupIds) {
      await user.related('groups').sync(validated.groupIds)
    }
    if (validated.roleIds) {
      await user.related('roles').sync(validated.roleIds)
    }
    if (validated.applicationIds) {
      await user.related('applications').sync(validated.applicationIds)
    }

    return response.ok({
      message: 'User successfully updated.',
      status: 'success',
    })
  }
}
