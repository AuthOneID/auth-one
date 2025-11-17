import Setting from '#models/setting'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class ApiKeyMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    /**
     * Middleware logic goes here (before the next call)
     */
    const apiToken = ctx.request.header('Authorization')?.replace('Bearer ', '')
    const apiTokenSetting = await Setting.query().where('id', 'api_token').first()

    if (!apiTokenSetting || apiTokenSetting.value !== apiToken) {
      return ctx.response.unauthorized({ message: 'Invalid API token' })
    }

    /**
     * Call next method in the pipeline and return its output
     */
    const output = await next()
    return output
  }
}
