import Setting from '#models/setting'
import User from '#models/user'
import { defineConfig } from '@adonisjs/inertia'
import type { InferSharedProps } from '@adonisjs/inertia/types'

const inertiaConfig = defineConfig({
  /**
   * Path to the Edge view that will be used as the root view for Inertia responses
   */
  rootView: 'inertia_layout',

  /**
   * Data that should be shared with all rendered pages
   */
  sharedData: {
    user: (ctx) => ctx.inertia.always(() => ctx.auth.user as User | null),
    flash: (ctx) => ctx.inertia.always(() => ctx.session.flashMessages.all()),
    settings: (ctx) =>
      ctx.inertia.always(async () => {
        const settings = await Setting.all()
        return settings.reduce(
          (acc, setting) => {
            acc[setting.id] = setting.value
            return acc
          },
          {} as Record<string, string | null>
        )
      }),
  },

  /**
   * Options for the server-side rendering
   */
  ssr: {
    enabled: false,
    entrypoint: 'inertia/app/ssr.tsx',
  },
})

export default inertiaConfig

declare module '@adonisjs/inertia/types' {
  export interface SharedProps extends InferSharedProps<typeof inertiaConfig> {}
}
