import type { HttpContext } from '@adonisjs/core/http'

export default class DashboardController {
  public async index({ inertia }: HttpContext) {
    // Generate dummy data for stats
    const stats = {
      totalUsers: 1245,
      totalGroups: 28,
      totalRoles: 15,
      totalApplications: 42,
    }

    // Generate dummy data for last 7 days login activity
    const loginData = []
    const today = new Date()

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

      loginData.push({
        date: dateStr,
        success: Math.floor(Math.random() * 100) + 50, // Random 50-150
        failed: Math.floor(Math.random() * 30) + 5, // Random 5-35
      })
    }

    return inertia.render('dashboard/index', {
      stats,
      loginData,
    })
  }
}
