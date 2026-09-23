import { Hono } from 'hono'
import { listFeedbackDto } from '@ying/shared'
import { pms } from '@ying/shared/permission'
import { zValidator, paramId } from '@/business/base.validator'
import { authValidator, pmsValidator } from '@/business/modules/sys'
import { feedbackService } from '@/business/modules/feedback'

export const feedback = new Hono()
  .use(authValidator, pmsValidator(pms.feedback))
  .get('/list', zValidator('query', listFeedbackDto), async c =>
    c.json(await feedbackService.list(c.req.valid('query')))
  )
  .get('/list-count', zValidator('query', listFeedbackDto), async c =>
    c.json(await feedbackService.listCount(c.req.valid('query')))
  )
  .delete('/:id', pmsValidator(pms.feedback.delete), paramId, async c => {
    await feedbackService.delete(c.req.valid('param').id)
    return c.json(null)
  })
