import { styleText } from 'node:util'
import { createMiddleware } from 'hono/factory'
import { appLogger } from './app-logger'

export const processTimeMiddleware = createMiddleware<{ Variables: AuthVariables }>(async (c, next) => {
  const now = Date.now()
  await next()
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
})
