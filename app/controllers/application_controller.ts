import { type HttpContext } from '@adonisjs/core/http'
import { getPaginatedResult } from '../lib/pagination.js'
import vine, { SimpleMessagesProvider } from '@vinejs/vine'
import { ModelAttributes } from '@adonisjs/lucid/types/model'
import Application from '#models/application'
import string from '@adonisjs/core/helpers/string'

vine.messagesProvider = new SimpleMessagesProvider(
  {
    required: '{{ field }} field is required',
  },
  {
    name: 'Nama',
    clientId: 'Client ID',
    clientSecret: 'Client Secret',
    redirectUris: 'Redirect URIs',
  }
)

const validator = vine.compile(
  vine.object({
    id: vine.string().uuid().optional(),
    name: vine.string().minLength(1).maxLength(254),
    clientId: vine.string().optional(),
    clientSecret: vine.string().optional(),
    redirectUris: vine.string().optional(),
  })
)

export default class ApplicationController {
  public async index({ inertia, request }: HttpContext) {
    const query = Application.query()

    const results = await getPaginatedResult<ModelAttributes<Application>>(request, query, {
      defaultSort: ['name', 'asc'],
      searchColumns: ['name', 'client_id'],
    })

    return inertia.render('applications/index', results)
  }

  public async show({ inertia, params }: HttpContext) {
    return inertia.render('applications/detail', {
      application: async () => await this.getApplication(params.id),
    })
  }

  public async store({ response, request, session }: HttpContext) {
    const validated = await validator.validate(request.all())

    // Parse redirect URIs from string (one per line) to array
    const redirectUris = validated.redirectUris
      ? validated.redirectUris
          .split('\n')
          .map((uri) => uri.trim())
          .filter((uri) => uri.length > 0)
      : []

    if (validated.id) {
      const application = await Application.findOrFail(validated.id)
      await application
        .merge({
          name: validated.name,
          redirectUris: redirectUris,
        })
        .save()

      session.flash('success', 'Application successfully updated.')
      return response.redirect().back()
    }

    // Generate random client ID and client secret for new applications
    const clientId = string.random(32)
    const clientSecret = string.random(64)

    const application = await Application.create({
      name: validated.name,
      clientId: clientId,
      clientSecret: clientSecret,
      redirectUris: redirectUris,
    })

    session.flash('success', 'Application successfully created.')
    session.flash('id', Date.now())
    session.flash('secret', clientSecret)

    return response.redirect(`/admin/applications/${application.id}`)
  }

  public async destroy({ response, params, session }: HttpContext) {
    const application = await Application.findOrFail(params.id)
    await application.delete()

    session.flash('success', 'Application successfully deleted.')
    session.flash('id', Date.now())

    return response.redirect('/admin/applications')
  }

  private async getApplication(id: string) {
    if (id === 'create') {
      return null
    }

    try {
      const application = await Application.query().where('id', id).firstOrFail()
      return application
    } catch (error) {
      return null
    }
  }
}
