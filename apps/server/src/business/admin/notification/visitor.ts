import { Hono } from 'hono'
import { z } from 'zod'
import { listVisitorDto } from '@ying/shared'
import { pms } from '@ying/shared/permission'
import { zValidator } from '@/business/base-validator'
import { authValidator, pmsValidator } from '@/business/modules/sys/auth'
import { visitorService } from '@/business/modules/notification'

export const visitor = new Hono()
  .use(authValidator, pmsValidator(pms.notification.visitor))
  .get('/list', zValidator('query', listVisitorDto), async c => c.json(await visitorService.list(c.req.valid('query'))))
  .get('/list-count', zValidator('query', listVisitorDto), async c =>
    c.json(await visitorService.listCount(c.req.valid('query')))
  )
  .delete(
    '/:visitorId',
    pmsValidator(pms.notification.visitor.delete),
    zValidator('param', z.object({ visitorId: z.string() })),
    async c => {
      return c.json(await visitorService.delete(c.req.valid('param')))
    }
  )
