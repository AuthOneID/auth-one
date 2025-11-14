import Application from '#models/application'
import Group from '#models/group'
import Role from '#models/role'
import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class DashboardController {
  private async getStats() {
    return await Promise.all([
      (async () => {
        const users = await User.query().count('* as total')
        return users[0].$extras.total
      })(),
      (async () => {
        const groups = await Group.query().count('* as total')
        return groups[0].$extras.total
      })(),
      (async () => {
        const roles = await Role.query().count('* as total')
        return roles[0].$extras.total
      })(),
      (async () => {
        const applications = await Application.query().count('* as total')
        return applications[0].$extras.total
      })(),
    ])
  }

  public async index({ inertia }: HttpContext) {
    const [totalUsers, totalGroups, totalRoles, totalApplications] = await this.getStats()
    const stats = {
      totalUsers,
      totalGroups,
      totalRoles,
      totalApplications,
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
