import { Hono } from 'hono'
import { listRoleDto, createRoleDto, updateRoleDto } from '@ying/shared'
import { pms } from '@ying/shared/permission'
import { zValidator, paramId } from '@/business/base-validator'
import { authValidator, pmsValidator, sysRoleService } from '@/business/modules/sys'

export const role = new Hono()
  .use(authValidator, pmsValidator(pms.sys.role))
  .get('/list', zValidator('query', listRoleDto), async c => {
    return c.json(await sysRoleService.list(c.req.valid('query')))
  })
  .get('/list-count', zValidator('query', listRoleDto), async c => {
    return c.json(await sysRoleService.listCount(c.req.valid('query')))
  })
  .delete('/:id', pmsValidator(pms.sys.role.delete), paramId, async c => {
    return c.json(await sysRoleService.delete(c.req.valid('param').id))
  })
  .post('/', pmsValidator(pms.sys.role.create), zValidator('json', createRoleDto), async c => {
    return c.json(await sysRoleService.create(c.req.valid('json')))
  })
  .put('/', pmsValidator(pms.sys.role.update), zValidator('json', updateRoleDto), async c => {
    return c.json(await sysRoleService.update(c.req.valid('json')))
  })
