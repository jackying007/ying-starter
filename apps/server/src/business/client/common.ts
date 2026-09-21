import { Hono } from 'hono'
import { createFeedbackDto, FileSourceType, FileType } from '@ying/shared'
import { paramId, zValidator } from '@/business/base-validator'
import { authValidator } from '@/business/modules/user/auth'
import { feedbackService } from '@/business/modules/feedback'
import { pushRecordService } from '@/business/modules/notification'
import { fileMiddleware, fileService } from '@/common/modules/storage'

export const common = new Hono()
  .post('/feedback', zValidator('json', createFeedbackDto), async c =>
    c.json(await feedbackService.create(c.req.valid('json')))
  )
  .post('/file/image', authValidator, fileMiddleware({ fileType: /^image\// }), async c => {
    const file = c.get('uploadedFile')
    const body = c.get('uploadBody')
    const userId = c.get('userId')
    return c.json(
      await fileService.uploadFile({
        file,
        fileType: FileType.Image,
        from: FileSourceType.Client,
        userId,
        extra: typeof body.extra === 'string' ? (JSON.parse(body.extra) as object) : undefined
      })
    )
  })
  .get('/notice/:id/click', paramId, async c => c.json(await pushRecordService.click(c.req.valid('param').id)))
