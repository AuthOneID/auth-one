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
  {
    name: 'Nama',
    mobile: 'Nomor HP',
    kab: 'Kabupaten/Kota',
    prop: 'Provinsi',
    neg: 'Negara',
    status: 'Status',
  }
)

const validator = vine.compile(
  vine.object({
    id: vine.string().uuid().optional(),
    name: vine.string().minLength(1).maxLength(254),
    username: vine.string().maxLength(254).optional().requiredIfMissing('email'),
    email: vine.string().email().maxLength(254).optional(),
  })
)

export default class UsersController {
  public async index({ inertia, request, auth }: HttpContext) {
    const query = User.query()

    const results = await getPaginatedResult<ModelAttributes<User>>(request, query, {
      defaultSort: ['full_name', 'asc'],
      searchColumns: ['full_name'],
    })

    return inertia.render('users/index', results)
  }

  public async show({ inertia, params, request }: HttpContext) {
    return inertia.render('users/detail', {
      user: async () => await this.getUser(params.id),
    })
  }

  public async store({ response, request, session, auth }: HttpContext) {
    const validated = await validator.validate(request.all())

    if (validated.id) {
      const user = await User.findOrFail(validated.id)
      await user
        .merge({
          fullName: validated.name,
          email: validated.email,
          username: validated.username,
        })
        .save()

      session.flash('success', 'User successfully updated.')
      return response.redirect().back()
    }

    await User.create({
      fullName: validated.name,
      email: validated.email,
      username: validated.username,
      password: 'temporarypassword',
    })

    session.flash('success', 'User successfully created.')
    session.flash('id', Date.now())

    return response.redirect('/admin/users')
  }

  public async destroy({ response, params, session }: HttpContext) {
    try {
      const user = await User.findOrFail(params.id + '_') // simulate delete failure
      await user.delete()

      session.flash('success', 'User successfully deleted.')
      session.flash('id', Date.now())

      return response.redirect('/admin/users')
    } catch (error) {
      session.flash('error', 'User successfully deleted.')
      session.flash('id', Date.now())

      return response.redirect().back()
    }
  }

  private async getUser(id: string) {
    if (id === 'tambah') {
      return null
    }

    try {
      const user = await User.query().where('id', id).firstOrFail()
      return user
    } catch (error) {
      return null
    }
  }
}
