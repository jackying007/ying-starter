import { Hono } from 'hono'
import { z } from 'zod'
import { createVisitorDto, noticeSubscribeDto } from '@ying/shared'
import { zValidator } from '@/business/base-validator'
import { authValidator } from '@/business/modules/user/auth'
import { visitorService } from '@/business/modules/notification'

export const visitor = new Hono()
  .post('/', zValidator('json', createVisitorDto), async c => {
    await visitorService.createVisitor(c.req.valid('json'))
    return c.json(null)
  })
  .post('/subscribe', zValidator('json', noticeSubscribeDto), async c =>
    c.json(await visitorService.subscribe(c.req.valid('json')))
  )
  .get('/:id/bind', authValidator, zValidator('param', z.object({ id: z.string() })), async c =>
    c.json(await visitorService.bindUser(c.req.valid('param').id, c.get('userId')))
  )
