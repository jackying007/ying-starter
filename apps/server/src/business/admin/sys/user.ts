import { Hono } from 'hono'
import { listSysUserDto, createOrUpdateSysUserDto, updateSysUserPasswordDto } from '@ying/shared'
import { pms } from '@ying/shared/permission'
import { omitArray } from '@ying/utils'
import { zValidator, paramId } from '@/business/base-validator'
import { authValidator, pmsValidator, sysUserService } from '@/business/modules/sys'

export const user = new Hono()
  .use(authValidator, pmsValidator(pms.sys.user))
  .get('/list', zValidator('query', listSysUserDto), async c => {
    const users = await sysUserService.list(c.req.valid('query'))
    return c.json(omitArray(users, 'password'))
  })
  .get('/list-count', zValidator('query', listSysUserDto), async c =>
    c.json(await sysUserService.listCount(c.req.valid('query')))
  )
  .delete('/:id', pmsValidator(pms.sys.user.delete), paramId, async c =>
    c.json(await sysUserService.delete(c.req.valid('param').id))
  )
  .post('/', pmsValidator(pms.sys.user.create), zValidator('json', createOrUpdateSysUserDto), async c =>
    c.json(await sysUserService.createOrUpdate(c.req.valid('json')))
  )
  .put('/', pmsValidator(pms.sys.user.update), zValidator('json', createOrUpdateSysUserDto), async c =>
    c.json(await sysUserService.createOrUpdate(c.req.valid('json')))
  )
  .put('/password', pmsValidator(pms.sys.user.update), zValidator('json', updateSysUserPasswordDto), async c =>
    c.json(await sysUserService.updatePassword(c.req.valid('json')))
  )
