import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { adminLoginDto, updateSysUserSelfPasswordDto, updateSysUserSelfUserInfoDto } from '@ying/shared'
import { omit } from '@ying/utils'
import { zValidator } from '@/business/base-validator'
import { requireAuth, sysAuthService } from '@/business/modules/sys'
import { getRefreshTokenFromContext } from '@/common/utils'

export const sysAuth = new Hono<{ Variables: AuthVariables }>()
  .post('/login', zValidator('json', adminLoginDto), async c => c.json(await sysAuthService.login(c.req.valid('json'))))
  .get('/refresh', async c => c.json(await sysAuthService.refreshToken(getRefreshTokenFromContext(c) ?? '')))
  .get('/logout', async c => {
    const { userId } = await requireAuth(c)
    const refreshToken = getRefreshTokenFromContext(c)
    if (!refreshToken) throw new HTTPException(401, { message: 'Unauthorized' })
    await sysAuthService.logout(userId, refreshToken)
    return c.json(null)
  })
  .get('/user-info', async c => {
    const { userId } = await requireAuth(c)
    const user = await sysAuthService.getUserInfo(userId)
    return c.json(omit(user, 'password'))
  })
  .put('/user-info', zValidator('json', updateSysUserSelfUserInfoDto), async c => {
    const { userId } = await requireAuth(c)
    return c.json(await sysAuthService.updateUserInfo(c.req.valid('json'), userId))
  })
  .put('/user-password', zValidator('json', updateSysUserSelfPasswordDto), async c => {
    const { userId } = await requireAuth(c)
    return c.json(await sysAuthService.updateUserPassword(c.req.valid('json'), userId))
  })
