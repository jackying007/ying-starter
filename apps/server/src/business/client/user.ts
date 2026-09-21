import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { resetPasswordDto, updateUserInfoDto } from '@ying/shared'
import { omit } from '@ying/utils'
import { zValidator } from '@/business/base-validator'
import { authValidator } from '@/business/modules/user/auth'
import { userService } from '@/business/modules/user'

export const user = new Hono()
  .use(authValidator)
  .get('/info', async c => {
    const user = await userService.findById(c.get('userId'))
    if (!user) throw new HTTPException(401, { message: 'Unauthorized.' })
    return c.json({
      ...omit(user, 'password'),
      hasPassword: Boolean(user.password)
    })
  })
  .put('/', zValidator('json', updateUserInfoDto), async c =>
    c.json(await userService.updateInfo(c.req.valid('json'), c.get('userId')))
  )
  .put('/reset-password', zValidator('json', resetPasswordDto), async c => {
    await userService.resetPassword(c.req.valid('json'), c.get('userId'))
    return c.json(null)
  })
