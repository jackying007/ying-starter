import { HeadContent, Scripts, createRootRouteWithContext, useParams } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import { AppProvider } from '@/providers/app'
import type { AppRouterContext } from '@/types'

import appCss from '@/styles.css?url'

export const Route = createRootRouteWithContext<AppRouterContext>()({
  loader: ({ context: { i18n } }) => {
    const t = i18n.getFixedT(i18n.language)
    return {
      title: t('app_title')
    }
  },
  head: ({ loaderData }) => {
    return {
      meta: [
        {
          charSet: 'utf-8'
        },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1'
        },
        {
          title: loaderData?.title
        }
      ],
      links: [
        {
          rel: 'stylesheet',
          href: appCss
        },
        {
          rel: 'icon',
          type: 'image/png',
          href: '/logo.png'
        }
      ]
    }
  },
  shellComponent: RootDocument
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const { lang } = useParams({ from: '/$lang' })

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <AppProvider>{children}</AppProvider>
        <TanStackDevtools
          config={{
            position: 'bottom-right'
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />
            }
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
