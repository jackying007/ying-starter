import { createMiddleware } from 'hono/factory'
import { requireAuth } from './require.auth'

export const authValidator = createMiddleware<{
  Variables: AuthVariables
}>(async (c, next) => {
  await requireAuth(c)
  await next()
})
