import type { ErrorHandler } from 'hono'
import type { ErrorVo } from '@ying/shared'
import { authConfig } from '@/config'
import { appLogger } from '@/app-logger'

export const oauthErrorHandler: ErrorHandler = (err, c) => {
  const errRes: ErrorVo = {
    status: 500,
    message: err.message,
    path: c.req.path
  }

  appLogger.error(errRes)

  return c.redirect(`${authConfig.authClientUrl}/${c.get('language')}/auth/error?msg=${err.message}`)
}
