import { createMiddleware, createStart } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import langParser from 'accept-language-parser'
import type { LngKeys } from '@ying/shared'
import { languagesWithSlashes, languages, fallbackLng } from '@/i18n/config'

const langMiddleware = createMiddleware({ type: 'request' }).server(({ request, next }) => {
  // 不是浏览器页面导航，直接放行
  if (request.headers.get('Sec-Fetch-Mode') !== 'navigate' || request.headers.get('Sec-Fetch-Dest') !== 'document')
    return next()

  const url = new URL(request.url)
  const hasLang = languagesWithSlashes.some(el => url.pathname.startsWith(el))
  if (!hasLang) {
    const acceptLanguageHeader = request.headers.get('Accept-Language')
    let lang: LngKeys = fallbackLng
    if (acceptLanguageHeader) {
      const matchedLanguage = langParser.pick(languages, acceptLanguageHeader, {
        loose: true
      })
      lang = matchedLanguage ?? lang
    }
    throw redirect({
      to: url.pathname.replace('/', `/${lang}/`) + url.search
    })
  }
  return next()
})

export const startInstance = createStart(() => {
  return {
    requestMiddleware: [langMiddleware]
  }
})
