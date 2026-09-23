import { Hono } from 'hono'
import { listSysUserDto, createOrUpdateSysUserDto, updateSysUserPasswordDto } from '@ying/shared'
import { pms } from '@ying/shared/permission'
import { omitArray } from '@ying/utils'
import { zValidator, paramId } from '@/business/base.validator'
import { authValidator, pmsValidator, sysUserService } from '@/business/modules/sys'

export const sysUser = new Hono()
  .use(authValidator, pmsValidator(pms.sys.user))
  .get('/list', zValidator('query', listSysUserDto), async c => {
    const users = await sysUserService.list(c.req.valid('query'))
    return c.json(omitArray(users, 'password'))
  })
  .get('/list-count', zValidator('query', listSysUserDto), async c =>
    c.json(await sysUserService.listCount(c.req.valid('query')))
  )
  .delete('/:id', pmsValidator(pms.sys.user.delete), paramId, async c => {
    await sysUserService.delete(c.req.valid('param').id)
    return c.json(null)
  })
  .post('/', pmsValidator(pms.sys.user.create), zValidator('json', createOrUpdateSysUserDto), async c => {
    await sysUserService.createOrUpdate(c.req.valid('json'))
    return c.json(null)
  })
  .put('/', pmsValidator(pms.sys.user.update), zValidator('json', createOrUpdateSysUserDto), async c => {
    await sysUserService.createOrUpdate(c.req.valid('json'))
    return c.json(null)
  })
  .put('/password', pmsValidator(pms.sys.user.update), zValidator('json', updateSysUserPasswordDto), async c => {
    await sysUserService.updatePassword(c.req.valid('json'))
    return c.json(null)
  })
