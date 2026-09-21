import type { ErrorHandler } from 'hono'
import { HTTPException } from 'hono/http-exception'
import type { ContentfulStatusCode } from 'hono/utils/http-status'
import { ZodError } from 'zod'
import type { ErrorVo } from '@ying/shared'
import { appLogger } from './app-logger'

export const appErrorHandler: ErrorHandler = (err, { req, json }) => {
  const errRes: ErrorVo = {
    status: 500,
    message: err.message,
    path: req.path
  }

  if (err instanceof HTTPException) {
    errRes.status = err.status
    if (err.cause instanceof ZodError) {
      const firstIssue = err.cause.issues[0]
      errRes.message += ` ${firstIssue.path.join('.')}: ${firstIssue.message}`
    }
  }

  appLogger.error(errRes)

  return json(errRes, errRes.status as ContentfulStatusCode)
}
