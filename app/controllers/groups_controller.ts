import { type HttpContext } from '@adonisjs/core/http'
import { getPaginatedResult } from '../lib/pagination.js'
import vine, { SimpleMessagesProvider } from '@vinejs/vine'
import { ModelAttributes } from '@adonisjs/lucid/types/model'
import Group from '#models/group'

vine.messagesProvider = new SimpleMessagesProvider(
  {
    required: '{{ field }} field is required',
  },
  {}
)

const validator = vine.compile(
  vine.object({
    name: vine.string().minLength(1).maxLength(254),
    roleIds: vine
      .array(vine.string().uuid())
      .parse((x) => (Array.isArray(x) ? x.filter(Boolean) : []))
      .optional(),
    userIds: vine
      .array(vine.string().uuid())
      .parse((x) => (Array.isArray(x) ? x.filter(Boolean) : []))
      .optional(),
    applicationIds: vine
      .array(vine.string().uuid())
      .parse((x) => (Array.isArray(x) ? x.filter(Boolean) : []))
      .optional(),
  })
)

export default class GroupsController {
  public async index({ inertia, request, response }: HttpContext) {
    const query = Group.query()

    const results = await getPaginatedResult<ModelAttributes<Group>>(request, query, {
      defaultSort: ['name', 'asc'],
      searchColumns: ['name'],
    })

    if (request.input('json')) {
      return response.json(results)
    }

    return inertia.render('groups/index', results)
  }

  public async show({ inertia, params }: HttpContext) {
    const group = await this.getGroup(params.id)

    return inertia.render('groups/detail', {
      group: group,
    })
  }

  public async store({ response, request, session }: HttpContext) {
    const validated = await validator.validate(request.all())

    const group = await Group.create({
      name: validated.name,
    })

    if (validated.roleIds && validated.roleIds.length > 0) {
      await group.related('roles').attach(validated.roleIds)
    }

    session.flash('success', 'Group successfully created.')
    return response.redirect('/admin/groups')
  }

  public async update({ response, request, session, params }: HttpContext) {
    const validated = await validator.validate(request.all())

    const group = await Group.findOrFail(params.id)
    await group
      .merge({
        name: validated.name,
      })
      .save()

    if (validated.roleIds) {
      await group.related('roles').sync(validated.roleIds)
    }

    session.flash('success', 'Group successfully updated.')
    return response.redirect().back()
  }

  public async destroy({ response, params, session }: HttpContext) {
    const group = await Group.findOrFail(params.id)
    await group.delete()

    session.flash('success', 'Group successfully deleted.')

    return response.redirect('/admin/groups')
  }

  private async getGroup(id: string) {
    if (id === 'create') {
      return null
    }

    try {
      const group = await Group.query()
        .where('id', id)
        .preload('roles')
        .preload('applications')
        .preload('users')
        .firstOrFail()
      return group
    } catch (error) {
      return null
    }
  }
}
