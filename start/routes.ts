/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
const AuthorizesController = () => import('#controllers/authorizes_controller')
const UsersController = () => import('#controllers/users_controller')
const RolesController = () => import('#controllers/roles_controller')
const GroupsController = () => import('#controllers/groups_controller')
const ApplicationController = () => import('#controllers/application_controller')
const DashboardController = () => import('#controllers/dashboard_controller')
const LoginController = () => import('#controllers/login_controller')

router
  .group(() => {
    router.get('/', [DashboardController, 'index'])
    router.resource('/users', UsersController).apiOnly()
    router.resource('/roles', RolesController).apiOnly()
    router.resource('/groups', GroupsController).apiOnly()
    router.resource('/applications', ApplicationController).apiOnly()
  })
  .use([middleware.auth()])
  .prefix('admin')

router
  .group(() => {
    router.post('logout', [LoginController, 'logout'])
  })
  .use([middleware.auth()])

router
  .group(() => {
    router.get('login', [LoginController, 'show'])
    router.post('login', [LoginController, 'store'])
  })
  .use([middleware.guest()])

router
  .group(() => {
    router.get('/apps/:slug/authorize', [AuthorizesController, 'authorize'])
  })
  .use([middleware.silentAuth()])
