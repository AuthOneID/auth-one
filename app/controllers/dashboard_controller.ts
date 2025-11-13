import type { HttpContext } from '@adonisjs/core/http'

export default class DashboardController {
  public async index({ inertia, request }: HttpContext) {
    return inertia.render('dashboard/index')
  }
}
