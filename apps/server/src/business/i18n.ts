import { createI18n } from 'hono-i18n'
import { clientLanguagesConfig } from '@ying/shared'

export const { i18nMiddleware, getI18n } = createI18n({
  messages: {
    en: {
      emailVerificationTitle: 'Email Verification Code',
      emailVerificationContent:
        '<p>Verifying your email address, here is your verification code.</p><h1>{code}</h1><p>Effective within 5 minutes.</p>'
    },
    zh: {
      emailVerificationTitle: '邮箱验证码',
      emailVerificationContent: '<p>正在验证您的邮箱，这是您的验证码</p><h1>{code}</h1><p>5分钟内有效。</p>'
    }
  } as const,
  defaultLocale: clientLanguagesConfig.fallbackLng,
  getLocale: c => c.get('language')
})
