import { type HttpContext } from '@adonisjs/core/http'
import { getPaginatedResult } from '../lib/pagination.js'
import vine, { SimpleMessagesProvider } from '@vinejs/vine'
import { ModelAttributes } from '@adonisjs/lucid/types/model'
import Group from '#models/group'

vine.messagesProvider = new SimpleMessagesProvider(
  {
    required: '{{ field }} field is required',
  },
  {
    name: 'Nama',
  }
)

const validator = vine.compile(
  vine.object({
    id: vine.string().uuid().optional(),
    name: vine.string().minLength(1).maxLength(254),
  })
)

export default class GroupsController {
  public async index({ inertia, request }: HttpContext) {
    const query = Group.query()

    const results = await getPaginatedResult<ModelAttributes<Group>>(request, query, {
      defaultSort: ['name', 'asc'],
      searchColumns: ['name'],
    })

    return inertia.render('groups/index', results)
  }

  public async show({ inertia, params }: HttpContext) {
    return inertia.render('groups/detail', {
      group: async () => await this.getGroup(params.id),
    })
  }

  public async store({ response, request, session }: HttpContext) {
    const validated = await validator.validate(request.all())

    if (validated.id) {
      const group = await Group.findOrFail(validated.id)
      await group
        .merge({
          name: validated.name,
        })
        .save()

      session.flash('success', 'Group successfully updated.')
      return response.redirect().back()
    }

    await Group.create({
      name: validated.name,
    })

    session.flash('success', 'Group successfully created.')
    session.flash('id', Date.now())

    return response.redirect('/admin/groups')
  }

  public async destroy({ response, params, session }: HttpContext) {
    const group = await Group.findOrFail(params.id)
    await group.delete()

    session.flash('success', 'Group successfully deleted.')
    session.flash('id', Date.now())

    return response.redirect('/admin/groups')
  }

  private async getGroup(id: string) {
    if (id === 'tambah') {
      return null
    }

    try {
      const group = await Group.query().where('id', id).firstOrFail()
      return group
    } catch (error) {
      return null
    }
  }
}
