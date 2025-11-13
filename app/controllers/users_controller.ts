import { type HttpContext } from '@adonisjs/core/http'
import { getPaginatedResult } from '../lib/pagination.js'
import vine, { SimpleMessagesProvider } from '@vinejs/vine'
import { ModelAttributes } from '@adonisjs/lucid/types/model'
import User from '#models/user'

vine.messagesProvider = new SimpleMessagesProvider(
  {
    'required': '{{ field }} field is required',
    'username.required': 'Username or email is required',
  },
  {}
)

const validator = vine.compile(
  vine.object({
    name: vine.string().minLength(1).maxLength(254),
    username: vine.string().maxLength(254).optional().requiredIfMissing('email'),
    email: vine.string().email().maxLength(254).optional(),
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
)

export default class UsersController {
  public async index({ inertia, request, response }: HttpContext) {
    const query = User.query()

    const results = await getPaginatedResult<ModelAttributes<User>>(request, query, {
      defaultSort: ['full_name', 'asc'],
      searchColumns: ['full_name'],
    })

    if (request.input('json')) {
      return response.json(results)
    }

    return inertia.render('users/index', results)
  }

  public async show({ inertia, params }: HttpContext) {
    const user = await this.getUser(params.id)
    return inertia.render('users/detail', {
      user: user,
    })
  }

  public async store({ response, request, session }: HttpContext) {
    const validated = await validator.validate(request.all())

    const user = await User.create({
      fullName: validated.name,
      email: validated.email,
      username: validated.username,
      password: 'temporarypassword',
    })

    if (validated.groupIds && validated.groupIds.length > 0) {
      await user.related('groups').attach(validated.groupIds)
    }
    if (validated.roleIds && validated.roleIds.length > 0) {
      await user.related('roles').attach(validated.roleIds)
    }
    if (validated.applicationIds && validated.applicationIds.length > 0) {
      await user.related('applications').attach(validated.applicationIds)
    }

    session.flash('success', 'User successfully created.')

    return response.redirect('/admin/users')
  }

  public async update({ response, request, session, params }: HttpContext) {
    const validated = await validator.validate(request.all())

    const user = await User.findOrFail(params.id)
    await user
      .merge({
        fullName: validated.name,
        email: validated.email,
        username: validated.username,
      })
      .save()

    if (validated.groupIds) {
      await user.related('groups').sync(validated.groupIds)
    }
    if (validated.roleIds) {
      await user.related('roles').sync(validated.roleIds)
    }
    if (validated.applicationIds) {
      await user.related('applications').sync(validated.applicationIds)
    }

    session.flash('success', 'User successfully updated.')
    return response.redirect().back()
  }

  public async destroy({ response, params, session }: HttpContext) {
    const user = await User.findOrFail(params.id)
    await user.delete()

    session.flash('success', 'User successfully deleted.')

    return response.redirect('/admin/users')
  }

  private async getUser(id: string) {
    if (id === 'create') {
      return null
    }

    try {
      const user = await User.query()
        .where('id', id)
        .preload('groups')
        .preload('roles')
        .preload('applications')
        .firstOrFail()
      return user
    } catch (error) {
      return null
    }
  }
}
