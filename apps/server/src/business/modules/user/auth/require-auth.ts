import type { Context } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { getAccessTokenFromContext } from '@/common/utils'
import { authService } from '.'

export const requireAuth = async (
  c: Context<{
    Variables: AuthVariables
  }>
) => {
  try {
    const accesstoken = getAccessTokenFromContext(c)
    if (!accesstoken) throw Error

    const payload = await authService.verifyAccessToken(accesstoken)
    const userId = payload.id as number
    c.set('userId', userId)
    return { userId }
  } catch {
    throw new HTTPException(401, { message: 'Unauthorized' })
  }
}
