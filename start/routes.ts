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
const LoginController = () => import('#controllers/login_controller')
router.on('/').renderInertia('home')

router
  .group(() => {
    router.get('login', [LoginController, 'show'])
    router.post('login', [LoginController, 'store'])
  })
  .use([middleware.guest()])
