import { Hono } from 'hono'
import { listArticleDto } from '@ying/shared'
import { zValidator, paramId } from '@/business/base.validator'
import { articleService } from '@/business/modules/article'

export const article = new Hono()
  .get('/list', zValidator('query', listArticleDto), async c => c.json(await articleService.list(c.req.valid('query'))))
  .get('/list-count', zValidator('query', listArticleDto), async c =>
    c.json(await articleService.listCount(c.req.valid('query')))
  )
  .get('/:id', paramId, async c => c.json(await articleService.detail(c.req.valid('param').id)))
  .get('/:id/view', paramId, async c => {
    await articleService.view(c.req.valid('param').id)
    return c.json(null)
  })
