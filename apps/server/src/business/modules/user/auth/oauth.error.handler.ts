import type { ErrorHandler } from 'hono'
import { authConfig } from '@/config'
import { handleError } from '@/app.error.handler'

export const oauthErrorHandler: ErrorHandler = (err, c) => {
  const { message } = handleError(err, c)
  return c.redirect(`${authConfig.authClientUrl}/${c.get('language')}/auth/error?msg=${message}`)
}
