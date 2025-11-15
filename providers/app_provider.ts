import Group from '#models/group'
import User from '#models/user'
import type { ApplicationService } from '@adonisjs/core/types'
import { generateKey } from '../app/lib/jwt.js'

export default class AppProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  register() {}

  /**
   * The container bindings have booted
   */
  async boot() {}

  /**
   * The application has been booted
   */
  async start() {}

  /**
   * The process has been started
   */
  async ready() {
    await generateKey()
    const groupExist = await Group.query().first()
    let groupId = groupExist?.id
    if (!groupExist) {
      const { id } = await Group.create({
        name: 'AuthOne Admins',
        isSuperuser: true,
      })
      groupId = id
    }

    const userExist = await User.query().first()
    if (!userExist) {
      const user = await User.create({
        email: '',
        fullName: 'AuthOne Admin',
        password: 'admin',
        username: 'admin',
      })

      user.related('groups').attach([groupId!])
    }
  }

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {}
}
