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
const SettingsController = () => import('#controllers/settings_controller')
const AppsController = () => import('#controllers/apps_controller')
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
    router.resource('/settings', SettingsController).only(['index', 'store'])
  })
  .use([middleware.auth(), middleware.admin()])
  .prefix('admin')

router
  .group(() => {
    router.post('logout', [LoginController, 'logout'])
    router.get('apps', [AppsController, 'index'])
    router.get('/', [DashboardController, 'root'])
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
    router.get('/authorize', [AuthorizesController, 'authorize'])
  })
  .use([middleware.silentAuth()])

router.group(() => {
  router.post('/oauth/token', [AuthorizesController, 'oauthToken'])
  router.get('/.well-known/jwks.json', [AuthorizesController, 'getJwks'])
  router.get('/.well-known/openid-configuration', [AuthorizesController, 'getOpenidConfig'])
  router.get('logout', [LoginController, 'showLogout'])
})
