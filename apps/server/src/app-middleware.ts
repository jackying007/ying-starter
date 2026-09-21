import { styleText } from 'node:util'
import { createMiddleware } from 'hono/factory'
import type { ContentfulStatusCode } from 'hono/utils/http-status'
import { isBaseVo, wrapBaseVo } from '@ying/shared'
import { appLogger } from './app-logger'

export const appMiddleware = createMiddleware<{ Variables: AuthVariables }>(async (c, next) => {
  const now = Date.now()
  await next()
  const contentType = c.res.headers.get('content-type') ?? ''
  if (!contentType.includes('application/json') || c.res.status !== 200) return

  const useTime = Date.now() - now
  const method = c.req.method
  const path = c.req.path
  const userId = c.get('userId')
  const userStr = userId ? `uid=[${userId}]` : undefined
  const logArr = [styleText('cyan', `processing ${method} ${path}`)]
  if (userStr) {
    logArr.unshift(styleText('#FF8700', userStr))
  }
  if (useTime > 1000) {
    logArr.push(styleText('red', `use ${useTime}ms`))
    appLogger.warn(...logArr)
  } else {
    logArr.push(styleText('yellow', `use ${useTime}ms`))
    appLogger.log(...logArr)
  }

  const original = await c.res.clone().json()
  const body = isBaseVo(original) ? original : wrapBaseVo(0, original)
  c.res = c.json(body, c.res.status as ContentfulStatusCode)
})
