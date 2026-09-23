import { Hono } from 'hono'
import { listRoleDto, createOrUpdateRoleDto } from '@ying/shared'
import { pms } from '@ying/shared/permission'
import { zValidator, paramId } from '@/business/base.validator'
import { authValidator, pmsValidator, sysRoleService } from '@/business/modules/sys'

export const sysRole = new Hono()
  .use(authValidator, pmsValidator(pms.sys.role))
  .get('/list', zValidator('query', listRoleDto), async c => c.json(await sysRoleService.list(c.req.valid('query'))))
  .get('/list-count', zValidator('query', listRoleDto), async c =>
    c.json(await sysRoleService.listCount(c.req.valid('query')))
  )
  .get('/permissions', async c => c.json(await sysRoleService.listPermissions()))
  .delete('/:id', pmsValidator(pms.sys.role.delete), paramId, async c => {
    await sysRoleService.delete(c.req.valid('param').id)
    return c.json(null)
  })
  .post('/', pmsValidator(pms.sys.role.create), zValidator('json', createOrUpdateRoleDto), async c => {
    await sysRoleService.createOrUpdate(c.req.valid('json'))
    return c.json(null)
  })
  .put('/', pmsValidator(pms.sys.role.update), zValidator('json', createOrUpdateRoleDto), async c => {
    await sysRoleService.createOrUpdate(c.req.valid('json'))
    return c.json(null)
  })
