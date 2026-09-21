import { Hono } from 'hono'
import { FileSourceType, FileType, listFileDto } from '@ying/shared'
import { pms } from '@ying/shared/permission'
import { zValidator, paramId } from '@/business/base-validator'
import { authValidator, pmsValidator } from '@/business/modules/sys'
import { fileService } from '@/common/modules/storage'
import { fileMiddleware } from '@/common/modules/storage'

export const file = new Hono()
  .use(authValidator, pmsValidator(pms.file))
  .get('/list', zValidator('query', listFileDto), async c => c.json(await fileService.list(c.req.valid('query'))))
  .get('/list-count', zValidator('query', listFileDto), async c =>
    c.json(await fileService.listCount(c.req.valid('query')))
  )
  .delete('/:id', pmsValidator(pms.file.delete), paramId, async c => {
    await fileService.deleteFileById(c.req.valid('param').id)
    return c.json(null)
  })
  .post('/image', fileMiddleware({ fileType: /^image\// }), async c => {
    const file = c.get('uploadedFile')
    const body = c.get('uploadBody')
    const userId = c.get('userId')
    return c.json(
      await fileService.uploadFile({
        file,
        fileType: FileType.Image,
        from: FileSourceType.Admin,
        userId,
        extra: typeof body.extra === 'string' ? (JSON.parse(body.extra) as object) : undefined
      })
    )
  })
