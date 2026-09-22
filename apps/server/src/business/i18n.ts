import i18next, { type TFunction } from 'i18next'
import { clientLanguagesConfig } from '@ying/shared'
import { createMiddleware } from 'hono/factory'

const en = {
  emailVerificationTitle: 'Email Verification Code',
  emailVerificationContent:
    '<p>Verifying your email address, here is your verification code.</p><h1>{{code}}</h1><p>Effective within 5 minutes.</p>'
}

const zh = {
  translation: {
    emailVerificationTitle: '邮箱验证码',
    emailVerificationContent: '<p>正在验证您的邮箱，这是您的验证码</p><h1>{{code}}</h1><p>5分钟内有效。</p>'
  }
}

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation'
    resources: {
      translation: typeof en
    }
  }
}

const i18n = i18next.createInstance()

export type I18nVariables = {
  t: TFunction
}

export const i18nMiddleware = createMiddleware<{
  Variables: I18nVariables
}>(async (c, next) => {
  c.set('t', i18n.getFixedT(c.get('language')))
  await next()
})

await i18n.init({
  fallbackLng: clientLanguagesConfig.fallbackLng,
  resources: {
    en: { translation: en },
    zh: { translation: zh }
  }
})
