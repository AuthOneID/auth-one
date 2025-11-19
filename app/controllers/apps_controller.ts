import Application from '#models/application'
import type { HttpContext } from '@adonisjs/core/http'

export default class AppsController {
  public async index({ inertia, auth, request }: HttpContext) {
    await auth.user?.load('groups')
    await auth.user?.load('roles')
    await auth.user?.load('applications')
    const isSuperAdmin = auth.user?.groups.some((g) => g.isSuperuser)

    const apps = await Application.query()
      .preload('users')
      .preload('groups')
      .preload('roles')
      .orderBy('name')

    // Filter apps based on user access
    const filteredApps = apps.filter((app) => {
      const appUserIds = app.users.map((u) => u.id)
      const appGroupIds = app.groups.map((g) => g.id)
      const appRoleIds = app.roles.map((r) => r.id)

      const userGroupIds = auth.user!.groups.map((g) => g.id)
      const userRoleIds = auth.user!.roles.map((r) => r.id)

      const isAllowed =
        appUserIds.includes(auth.user!.id) ||
        appGroupIds.some((id) => userGroupIds.includes(id)) ||
        appRoleIds.some((id) => userRoleIds.includes(id))

      return isAllowed || isSuperAdmin
    })

    if (!isSuperAdmin && filteredApps.length === 1 && filteredApps[0].appUrl) {
      if (request.header('x-inertia')) {
        return inertia.location(filteredApps[0].appUrl)
      }
    }

    return inertia.render('apps/index', {
      apps: filteredApps,
      isSuperAdmin,
    })
  }
}
