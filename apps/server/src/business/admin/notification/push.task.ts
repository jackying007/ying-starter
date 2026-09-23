import { Hono } from 'hono'
import { listPushTaskDto, createOrUpdatePushTaskDto, setPushTaskDto } from '@ying/shared'
import { pms } from '@ying/shared/permission'
import { zValidator, paramId } from '@/business/base.validator'
import { authValidator, pmsValidator } from '@/business/modules/sys/auth'
import { pushTaskService, notificationService } from '@/business/modules/notification'

export const pushTask = new Hono()
  .use(authValidator, pmsValidator(pms.notification.pushTask))
  .get('/list', zValidator('query', listPushTaskDto), async c =>
    c.json(await pushTaskService.list(c.req.valid('query')))
  )
  .get('/list-count', zValidator('query', listPushTaskDto), async c =>
    c.json(await pushTaskService.listCount(c.req.valid('query')))
  )
  .delete('/:id', pmsValidator(pms.notification.pushTask.delete), paramId, async c => {
    await pushTaskService.delete(c.req.valid('param').id)
    return c.json(null)
  })
  .post('/', pmsValidator(pms.notification.pushTask.create), zValidator('json', createOrUpdatePushTaskDto), async c => {
    await pushTaskService.createOrUpdate(c.req.valid('json'))
    return c.json(null)
  })
  .put('/', pmsValidator(pms.notification.pushTask.update), zValidator('json', createOrUpdatePushTaskDto), async c => {
    await pushTaskService.createOrUpdate(c.req.valid('json'))
    return c.json(null)
  })
  .post('/set-up', pmsValidator(pms.notification.pushTask.setUp), zValidator('json', setPushTaskDto), async c => {
    await notificationService.setPuskTask(c.req.valid('json'))
    return c.json(null)
  })
  .get('/:id/stop-timing', pmsValidator(pms.notification.pushTask.stopTiming), paramId, async c => {
    await notificationService.stopTimingPushTask(c.req.valid('param').id)
    return c.json(null)
  })
