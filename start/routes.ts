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
const UsersController = () => import('#controllers/users_controller')
const DashboardController = () => import('#controllers/dashboard_controller')
const LoginController = () => import('#controllers/login_controller')

router
  .group(() => {
    router.get('/', [DashboardController, 'index'])
    router.resource('/users', UsersController).only(['index', 'show', 'store', 'destroy'])
  })
  .use([middleware.auth()])
  .prefix('admin')

router
  .group(() => {
    router.get('login', [LoginController, 'show'])
    router.post('login', [LoginController, 'store'])
  })
  .use([middleware.guest()])
