import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { createI18nInstance, getLang } from '@/i18n'
import { getCookie } from '@/cookie'
import { CookieEnum } from '@/enum'
import { NotFound } from '@/layouts/not-found'
import { Error } from '@/layouts/error'
import { routeTree } from './routeTree.gen'

export async function getRouter() {
  const i18n = await createI18nInstance(getLang())
  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    context: {
      i18n,
      auth: {
        accessToken: getCookie(CookieEnum.AccessToken),
        refreshToken: getCookie(CookieEnum.RefreshToken)
      }
    },
    defaultNotFoundComponent: NotFound,
    // 这个组件写在 route 内还是会显示默认的
    defaultErrorComponent: props => <Error {...props} />
  })
  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
