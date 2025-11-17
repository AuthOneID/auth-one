import Setting from '#models/setting'
import stringHelpers from '@adonisjs/core/helpers/string'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import vine from '@vinejs/vine'
import path from 'node:path'

const validator = vine.compile(
  vine.object({
    title: vine.string().maxLength(255).optional(),
    logo: vine
      .file({
        size: '2mb',
        extnames: ['jpg', 'png', 'jpeg', 'gif', 'svg'],
      })
      .optional(),
  })
)

export default class SettingsController {
  public async index({ inertia }: HttpContext) {
    const settings = await Setting.all()

    return inertia.render('settings/detail', {
      settings: settings.reduce(
        (acc, setting) => {
          acc[setting.id] = setting.value
          return acc
        },
        {} as Record<string, any>
      ),
    })
  }

  public async store({ request, response, session }: HttpContext) {
    if (request.input('action') === 'generate_api_token') {
      const apiToken = stringHelpers.generateRandom(64)
      await Setting.updateOrCreate({ id: 'api_token' }, { value: apiToken })

      session.flash('success', 'API token successfully generated.')
      return response.redirect().back()
    }

    const validated = await validator.validate(request.all())

    await Setting.updateOrCreate({ id: 'title' }, { value: validated.title || '' })

    if (validated.logo) {
      await validated.logo.move(app.makePath('storage/uploads'))
      await Setting.updateOrCreate(
        { id: 'logo' },
        { value: path.join('storage/uploads', validated.logo.fileName!) }
      )
    }

    session.flash('success', 'Settings successfully updated.')
    return response.redirect().back()
  }
}
