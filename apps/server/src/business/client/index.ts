import { Hono } from 'hono'
import { languageDetector } from 'hono/language'
import { clientLanguagesConfig } from '@ying/shared'
import { i18nMiddleware } from '@/business/i18n'
import { common } from './common'
import { auth, oauth } from './auth'
import { user } from './user'
import { article } from './article'
import { visitor } from './visitor'

export const client = new Hono()
  .use(
    languageDetector({
      supportedLanguages: clientLanguagesConfig.languages,
      fallbackLanguage: clientLanguagesConfig.fallbackLng,
      lookupCookie: 'lang'
    }),
    i18nMiddleware
  )
  .route('', common)
  .route('/auth', auth)
  .route('/auth', oauth)
  .route('/user', user)
  .route('/article', article)
  .route('/visitor', visitor)

export type ClientAPI = typeof client
