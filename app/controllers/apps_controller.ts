import type { HttpContext } from '@adonisjs/core/http'

export default class AppsController {
  public async index({ inertia, auth }: HttpContext) {
    await auth.user?.load('groups')
    const isSuperAdmin = auth.user?.groups.some((g) => g.isSuperuser)

    return inertia.render('apps/index', {
      apps: [],
      isSuperAdmin,
    })
  }
}
