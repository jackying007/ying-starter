import { Hono } from 'hono'
import { listUserDto } from '@ying/shared'
import { pms } from '@ying/shared/permission'
import { omitArray } from '@ying/utils'
import { zValidator } from '@/business/base.validator'
import { authValidator, pmsValidator } from '@/business/modules/sys/auth'
import { userService } from '@/business/modules/user'
import { HTTPException } from 'hono/http-exception'

export const user = new Hono()
  .use(authValidator, pmsValidator(pms.user))
  .get('/list', zValidator('query', listUserDto), async c => {
    const users = await userService.list(c.req.valid('query'))
    return c.json(omitArray(users, 'password'))
  })
  .get('/list-count', zValidator('query', listUserDto), async c =>
    c.json(await userService.listCount(c.req.valid('query')))
  )
  .get('/export', pmsValidator(pms.user.export), zValidator('query', listUserDto), async c => {
    const exportRes = await userService.export(c.req.valid('query'))
    if (!exportRes) throw new HTTPException(500)
    return c.body(exportRes.excelBuffer, 200, {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${encodeURIComponent(exportRes.fileName)}.xlsx"`
    })
  })
