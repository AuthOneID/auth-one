import { type HttpContext } from '@adonisjs/core/http'
import { getPaginatedResult } from '../lib/pagination.js'
import vine, { SimpleMessagesProvider } from '@vinejs/vine'
import { ModelAttributes } from '@adonisjs/lucid/types/model'
import Application from '#models/application'
import string from '@adonisjs/core/helpers/string'
import hash from '@adonisjs/core/services/hash'

vine.messagesProvider = new SimpleMessagesProvider(
  {
    'required': '{{ field }} field is required',
    'database.unique': 'The {{ field }} has already been taken',
  },
  {
    '0': 'input',
  }
)

const createValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(1).maxLength(254),
    slug: vine
      .string()
      .minLength(1)
      .maxLength(254)
      .unique(async (db, value) => {
        const result = await db.from('applications').where('slug', value).first()
        return !result
      })
      .optional(),
    redirectUris: vine
      .array(
        vine
          .string()
          .url({
            require_tld: false,
          })
          .maxLength(100)
      )
      .parse((x) =>
        typeof x === 'string'
          ? x
              .split('\n')
              .map((uri) => uri.trim())
              .filter((uri) => uri.length > 0)
          : []
      )
      .optional(),
    userIds: vine
      .array(vine.string().uuid())
      .parse((x) => (!x ? undefined : Array.isArray(x) ? x.filter(Boolean) : []))
      .optional(),
    groupIds: vine
      .array(vine.string().uuid())
      .parse((x) => (!x ? undefined : Array.isArray(x) ? x.filter(Boolean) : []))
      .optional(),
    roleIds: vine
      .array(vine.string().uuid())
      .parse((x) => (!x ? undefined : Array.isArray(x) ? x.filter(Boolean) : []))
      .optional(),
    appUrl: vine.string().maxLength(254).optional(),
  })
)

const updateValidator = (applicationId: string) =>
  vine.compile(
    vine.object({
      name: vine.string().minLength(1).maxLength(254),
      slug: vine
        .string()
        .minLength(1)
        .maxLength(254)
        .unique(async (db, value) => {
          const result = await db
            .from('applications')
            .where('slug', value)
            .whereNot('id', applicationId)
            .first()
          return !result
        })
        .optional(),
      redirectUris: vine
        .array(
          vine
            .string()
            .url({
              require_tld: false,
            })
            .maxLength(100)
        )
        .parse((x) =>
          typeof x === 'string'
            ? x
                .split('\n')
                .map((uri) => uri.trim())
                .filter((uri) => uri.length > 0)
            : []
        )
        .optional(),
      userIds: vine
        .array(vine.string().uuid())
        .parse((x) => (!x ? undefined : Array.isArray(x) ? x.filter(Boolean) : []))
        .optional(),
      groupIds: vine
        .array(vine.string().uuid())
        .parse((x) => (!x ? undefined : Array.isArray(x) ? x.filter(Boolean) : []))
        .optional(),
      roleIds: vine
        .array(vine.string().uuid())
        .parse((x) => (!x ? undefined : Array.isArray(x) ? x.filter(Boolean) : []))
        .optional(),
      appUrl: vine.string().url({ require_tld: false }).maxLength(254).optional(),
    })
  )

export default class ApplicationController {
  public async index({ inertia, request, response }: HttpContext) {
    const query = Application.query()

    const results = await getPaginatedResult<ModelAttributes<Application>>(request, query, {
      defaultSort: ['name', 'asc'],
      searchColumns: ['name', 'client_id'],
    })

    if (request.input('json')) {
      return response.json(results)
    }

    return inertia.render('applications/index', results)
  }

  public async show({ inertia, params }: HttpContext) {
    const application = await this.getApplication(params.id)

    return inertia.render('applications/detail', {
      application: application,
    })
  }

  public async store({ response, request, session }: HttpContext) {
    const validated = await createValidator.validate(request.all())

    // Generate random client ID and client secret for new applications
    const clientId = string.random(32)
    const clientSecret = string.random(64)

    const application = await Application.create({
      name: validated.name,
      slug: validated.slug || string.slug(validated.name),
      clientId: clientId,
      clientSecret: await hash.use('argon').make(clientSecret),
      redirectUris: validated.redirectUris,
      appUrl: validated.appUrl ?? null,
    })

    if (validated.userIds && validated.userIds.length > 0) {
      await application.related('users').attach(validated.userIds)
    }
    if (validated.groupIds && validated.groupIds.length > 0) {
      await application.related('groups').attach(validated.groupIds)
    }
    if (validated.roleIds && validated.roleIds.length > 0) {
      await application.related('roles').attach(validated.roleIds)
    }

    session.flash('success', 'Application successfully created.')
    session.flash('secret', clientSecret)

    return response.redirect(`/admin/applications/${application.id}`)
  }

  public async update({ response, request, session, params }: HttpContext) {
    const validated = await updateValidator(params.id).validate(request.all())

    const application = await Application.findOrFail(params.id)
    await application
      .merge({
        name: validated.name,
        slug: validated.slug || string.slug(validated.name),
        redirectUris: validated.redirectUris,
        appUrl: validated.appUrl ?? null,
      })
      .save()

    if (validated.userIds) {
      await application.related('users').sync(validated.userIds)
    }
    if (validated.groupIds) {
      await application.related('groups').sync(validated.groupIds)
    }
    if (validated.roleIds) {
      await application.related('roles').sync(validated.roleIds)
    }

    session.flash('success', 'Application successfully updated.')
    return response.redirect().back()
  }

  public async destroy({ response, params, session }: HttpContext) {
    const application = await Application.findOrFail(params.id)
    await application.delete()

    session.flash('success', 'Application successfully deleted.')

    return response.redirect('/admin/applications')
  }

  private async getApplication(id: string) {
    if (id === 'create') {
      return null
    }

    try {
      const application = await Application.query()
        .where('id', id)
        .preload('users')
        .preload('groups')
        .preload('roles')
        .firstOrFail()
      return application
    } catch (error) {
      return null
    }
  }
}
