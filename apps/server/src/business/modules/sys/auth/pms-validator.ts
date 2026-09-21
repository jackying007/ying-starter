import { createMiddleware } from 'hono/factory'
import { HTTPException } from 'hono/http-exception'
import type { TPermission } from '@ying/shared/permission'
import { redis } from '@/common/modules/redis'
import { CacheKey, sysAuthService } from '.'

export const pmsValidator = (...permissions: TPermission[]) =>
  createMiddleware<{ Variables: AuthVariables }>(async (c, next) => {
    try {
      const userId = c.get('userId')
      if (!userId) throw Error

      const KEY = `${CacheKey.AdminAuthPermission}:${userId}`
      const userPermissionCodesStr = await redis.get(KEY)
      let userPermissionCodes: string[] = []
      if (!userPermissionCodesStr) {
        if (userId) {
          const userInfo = await sysAuthService.getUserInfo(userId)
          if (userInfo.permissions) {
            userPermissionCodes = userInfo.permissions.map(el => el.code)
            await redis.set(KEY, JSON.stringify(userPermissionCodes))
          }
        }
      } else {
        userPermissionCodes = JSON.parse(userPermissionCodesStr) as string[]
      }

      const permissionCodes = permissions.map(el => el.code).filter(code => typeof code === 'string')
      if (!permissionCodes.every(el => userPermissionCodes.includes(el))) throw Error

      await next()
    } catch {
      throw new HTTPException(401, { message: 'Unauthorized' })
    }
  })
