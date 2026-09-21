import { Hono } from 'hono'
import { listPushTemplateDto, createOrUpdatePushTemplateDto, sendPushTemplateDto } from '@ying/shared'
import { pms } from '@ying/shared/permission'
import { zValidator, paramId } from '@/business/base-validator'
import { authValidator, pmsValidator } from '@/business/modules/sys/auth'
import { pushTemplateService, notificationService } from '@/business/modules/notification'

export const pushTemplate = new Hono()
  .use(authValidator, pmsValidator(pms.notification.pushTemplate))
  .get('/list', zValidator('query', listPushTemplateDto), async c =>
    c.json(await pushTemplateService.list(c.req.valid('query')))
  )
  .get('/list-count', zValidator('query', listPushTemplateDto), async c =>
    c.json(await pushTemplateService.listCount(c.req.valid('query')))
  )
  .delete('/:id', pmsValidator(pms.notification.pushTemplate.delete), paramId, async c =>
    c.json(await pushTemplateService.delete(c.req.valid('param').id))
  )
  .post(
    '/',
    pmsValidator(pms.notification.pushTemplate.create),
    zValidator('json', createOrUpdatePushTemplateDto),
    async c => c.json(await pushTemplateService.createOrUpdate(c.req.valid('json')))
  )
  .put(
    '/',
    pmsValidator(pms.notification.pushTemplate.update),
    zValidator('json', createOrUpdatePushTemplateDto),
    async c => c.json(await pushTemplateService.createOrUpdate(c.req.valid('json')))
  )
  .post('/send', pmsValidator(pms.notification.pushTemplate.send), zValidator('json', sendPushTemplateDto), async c =>
    c.json(await notificationService.sendNotification(c.req.valid('json')))
  )
