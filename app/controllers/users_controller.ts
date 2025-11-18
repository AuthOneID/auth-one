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

const createValidator = vine.compile(
  vine.object({
    ...schema.getProperties(),
    password: vine.string().minLength(8).confirmed({
      confirmationField: 'passwordConfirmation',
    }),
  })
)
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

  public async showProfile({ inertia, auth }: HttpContext) {
    await auth.user?.load('groups')
    const isSuperAdmin = auth.user?.groups.some((g) => g.isSuperuser)

    return inertia.render('profile/detail', {
      user: auth.user,
      isSuperAdmin: isSuperAdmin,
    })
  }

  public async store({ response, request, session }: HttpContext) {
    const validated = await createValidator.validate(request.all())

    const user = await User.create({
      fullName: validated.name,
      email: validated.email,
      username: validated.username,
      password: validated.password,
      isActive: validated.isActive ?? true,
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

    session.flash('success', 'User successfully updated.')
    return response.redirect().back()
  }

  public async updateProfile({ response, request, session, auth }: HttpContext) {
    const validated = await updateValidator.validate(request.all())

    const updateData: any = {
      fullName: validated.name,
      email: validated.email,
    }

    // Only update password if provided
    if (validated.password) {
      updateData.password = validated.password
    }

    await auth.user?.merge(updateData).save()

    session.flash('success', 'Profile successfully updated.')
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
