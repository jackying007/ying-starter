import { Hono } from 'hono'
import { statDto } from '@ying/shared'
import { pms } from '@ying/shared/permission'
import { zValidator } from '@/business/base.validator'
import { userStatService } from '@/business/modules/user'
import { authValidator, pmsValidator } from '@/business/modules/sys'

export const userStat = new Hono()
  .use(authValidator, pmsValidator(pms.dashboard))
  .get('/growth-total', async c => c.json(await userStatService.getUserGrowthTotal()))
  .get('/growth-trend-all', zValidator('query', statDto), async c =>
    c.json(await userStatService.getUserGrowthTrendAll(c.req.valid('query')))
  )
  .get('/growth-trend', zValidator('query', statDto), async c =>
    c.json(await userStatService.getUserGrowthTrend(c.req.valid('query')))
  )
