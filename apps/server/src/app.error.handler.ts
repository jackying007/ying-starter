import type { ErrorHandler } from 'hono'
import { HTTPException } from 'hono/http-exception'
import type { ContentfulStatusCode } from 'hono/utils/http-status'
import { ZodError } from 'zod'
import { appLogger } from './app.logger'

export const handleError = (...[err, c]: Parameters<ErrorHandler>) => {
  let status: ContentfulStatusCode = 500
  let message = err.message

  if (err instanceof HTTPException) {
    status = err.status
    if (err.cause instanceof ZodError) {
      const firstIssue = err.cause.issues[0]
      message += ` ${firstIssue.path.join('.')}: ${firstIssue.message}`
    }
  }

  const errObj = {
    userId: c.get('userId'),
    status,
    message,
    path: c.req.path
  }
  if (!errObj.userId) delete errObj.userId
  appLogger.error(errObj)

  return {
    message,
    status
  }
}

export const appErrorHandler: ErrorHandler = (err, c) => {
  const { message, status } = handleError(err, c)
  return c.text(message, status)
}
