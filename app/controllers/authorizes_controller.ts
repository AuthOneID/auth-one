import { base64 } from '@adonisjs/core/helpers'
import type { HttpContext } from '@adonisjs/core/http'

export default class AuthorizesController {
  public async authorize({ response, auth, request }: HttpContext) {
    if (!auth.user) {
      return response.redirect(`/login?redirect=${base64.urlEncode(request.url(true))}`)
    }

    return response.redirect('https://google.com')
  }
}
