import { Hono } from 'hono'
import { pms } from '@ying/shared/permission'
import { authValidator, pmsValidator, sysSettingService } from '@/business/modules/sys'

export const setting = new Hono()
  .use(authValidator)
  .get('/clear-permission-cache', pmsValidator(pms.sys.setting.clearPermissionCache), async c => {
    c.get('userId')
    await sysSettingService.clearPermissionCache()
    return c.json(null)
  })
  .get('/clear-drift-file', pmsValidator(pms.sys.setting.clearDriftFile), async c => {
    await sysSettingService.clearDriftFile()
    return c.json(null)
  })
