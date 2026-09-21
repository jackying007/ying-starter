import { Hono } from 'hono'
import { listArticleDto, createOrUpdateArticleDto, updateArticleContentDto, deleteDto } from '@ying/shared'
import { pms } from '@ying/shared/permission'
import { zValidator, paramId } from '@/business/base-validator'
import { authValidator, pmsValidator } from '@/business/modules/sys/auth'
import { articleService } from '@/business/modules/article'

export const article = new Hono()
  .use(authValidator, pmsValidator(pms.article))
  .get('/list', zValidator('query', listArticleDto), async c => c.json(await articleService.list(c.req.valid('query'))))
  .get('/list-count', zValidator('query', listArticleDto), async c =>
    c.json(await articleService.listCount(c.req.valid('query')))
  )
  .get('/:id', paramId, async c => c.json(await articleService.detail(c.req.valid('param').id)))
  .post('/', pmsValidator(pms.article.create), zValidator('json', createOrUpdateArticleDto), async c =>
    c.json(await articleService.createOrUpdate(c.req.valid('json')))
  )
  .put('/', pmsValidator(pms.article.update), zValidator('json', createOrUpdateArticleDto), async c =>
    c.json(await articleService.createOrUpdate(c.req.valid('json')))
  )
  .put('/content', pmsValidator(pms.article.updateContent), zValidator('json', updateArticleContentDto), async c =>
    c.json(await articleService.updateContent(c.req.valid('json')))
  )
  .delete('/', pmsValidator(pms.article.delete), zValidator('json', deleteDto), async c =>
    c.json(await articleService.delete(c.req.valid('json').ids))
  )
