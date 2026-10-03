import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { adminLoginDto, updateSysUserSelfPasswordDto, updateSysUserSelfUserInfoDto } from '@ying/shared'
import { zValidator } from '@/business/base.validator'
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
    return c.json(await sysAuthService.getUserInfo(userId))
  })
  .put('/user-info', zValidator('json', updateSysUserSelfUserInfoDto), async c => {
    const { userId } = await requireAuth(c)
    await sysAuthService.updateUserInfo(userId, c.req.valid('json'))
    return c.json(null)
  })
  .put('/user-password', zValidator('json', updateSysUserSelfPasswordDto), async c => {
    const { userId } = await requireAuth(c)
    await sysAuthService.updateUserPassword(userId, c.req.valid('json'))
    return c.json(null)
  })
