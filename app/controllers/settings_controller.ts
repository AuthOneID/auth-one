import Setting from '#models/setting'
import stringHelpers from '@adonisjs/core/helpers/string'
import type { HttpContext } from '@adonisjs/core/http'

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
    //
  }
}
