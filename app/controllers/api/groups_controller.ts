import { type HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import User from '#models/user'
import Group from '#models/group'

const idValidator = vine.compile(
  vine.object({
    id: vine.string().uuid(),
  })
)

export default class ApiGroupsController {
  public async show({ params }: HttpContext) {
    const [err] = await vine.tryValidate({ schema: vine.string().uuid(), data: params.id })
    const user = err
      ? await User.query().where('username', params.id).orWhere('email', params.id).firstOrFail()
      : await User.findOrFail(params.id)

    return user
  }

  public async addUser({ response, request, params }: HttpContext) {
    const { id } = await idValidator.validate(request.all())

    const group = await Group.findOrFail(params.id)
    group.related('users').sync([id], false)

    return response.ok({ message: 'User added to group successfully' })
  }

  public async removeUser({ response, request, params }: HttpContext) {
    const { id } = await idValidator.validate(request.all())

    const group = await Group.findOrFail(params.id)
    group.related('users').detach([id])

    return response.ok({ message: 'User added to group successfully' })
  }
}
