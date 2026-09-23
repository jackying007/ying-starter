import { Hono } from 'hono'
import { listPushRecordDto } from '@ying/shared'
import { pms } from '@ying/shared/permission'
import { zValidator } from '@/business/base.validator'
import { authValidator, pmsValidator } from '@/business/modules/sys/auth'
import { pushRecordService } from '@/business/modules/notification'

export const pushRecord = new Hono()
  .use(authValidator, pmsValidator(pms.notification.pushRecord))
  .get('/list', zValidator('query', listPushRecordDto), async c =>
    c.json(await pushRecordService.list(c.req.valid('query')))
  )
  .get('/list-count', zValidator('query', listPushRecordDto), async c =>
    c.json(await pushRecordService.listCount(c.req.valid('query')))
  )
