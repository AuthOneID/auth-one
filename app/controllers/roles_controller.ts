import { type HttpContext } from '@adonisjs/core/http'
import { getPaginatedResult } from '../lib/pagination.js'
import vine, { SimpleMessagesProvider } from '@vinejs/vine'
import { ModelAttributes } from '@adonisjs/lucid/types/model'
import Role from '#models/role'

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

export default class RolesController {
  public async index({ inertia, request }: HttpContext) {
    const query = Role.query()

    const results = await getPaginatedResult<ModelAttributes<Role>>(request, query, {
      defaultSort: ['name', 'asc'],
      searchColumns: ['name'],
    })

    return inertia.render('roles/index', results)
  }

  public async show({ inertia, params }: HttpContext) {
    return inertia.render('roles/detail', {
      role: async () => await this.getRole(params.id),
    })
  }

  public async store({ response, request, session }: HttpContext) {
    const validated = await validator.validate(request.all())

    if (validated.id) {
      const role = await Role.findOrFail(validated.id)
      await role
        .merge({
          name: validated.name,
        })
        .save()

      session.flash('success', 'Role successfully updated.')
      return response.redirect().back()
    }

    await Role.create({
      name: validated.name,
    })

    session.flash('success', 'Role successfully created.')
    session.flash('id', Date.now())

    return response.redirect('/admin/roles')
  }

  public async destroy({ response, params, session }: HttpContext) {
    const role = await Role.findOrFail(params.id)
    await role.delete()

    session.flash('success', 'Role successfully deleted.')
    session.flash('id', Date.now())

    return response.redirect('/admin/roles')
  }

  private async getRole(id: string) {
    if (id === 'create') {
      return null
    }

    try {
      const role = await Role.query().where('id', id).firstOrFail()
      return role
    } catch (error) {
      return null
    }
  }
}
