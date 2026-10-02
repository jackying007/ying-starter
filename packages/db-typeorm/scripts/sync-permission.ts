import { In } from 'typeorm'
import { pms, type TPermission } from '@ying/shared/permission'
import dataSource from '../typeorm.config'
import { SysPermissionEntity } from '../dist'

function pmsToTree(permission: TPermission, sortId: number, parentCode: string | null) {
  const arr: SysPermissionEntity[] = []
  Object.keys(permission).forEach(key => {
    if (key !== 'label' && key !== 'code') {
      const permissionChild = permission[key] as TPermission
      if (!permissionChild.code) throw new Error('permission code is not exist')
      const sysPermission: Partial<SysPermissionEntity> = {
        ...permissionChild,
        sortId,
        parentCode,
        children: []
      }
      const children = pmsToTree(permissionChild, sortId + 1, permissionChild.code)
      if (children.length) sysPermission.children = children
      arr.push(sysPermission as SysPermissionEntity)
    }
  })
  return arr
}

void (async function () {
  console.log('同步权限中...')
  await dataSource.initialize()
  const sysPermissionRepository = dataSource.getRepository(SysPermissionEntity)
  const existPermissions = await sysPermissionRepository.find()
  const oldCodes = existPermissions.map(el => el.code)
  const newCodes: string[] = []

  const permissionTreeIntoDb = async (arr: SysPermissionEntity[]) => {
    newCodes.push(...arr.map(permission => permission.code))
    await Promise.all(
      arr.map(async permission => {
        if (oldCodes.includes(permission.code)) {
          await sysPermissionRepository.update(
            { code: permission.code },
            sysPermissionRepository.create({
              ...permission,
              children: undefined
            })
          )
        } else {
          await sysPermissionRepository.save(sysPermissionRepository.create(permission))
        }
        if (permission.children?.length) {
          await permissionTreeIntoDb(permission.children)
        }
      })
    )
  }
  console.log('正在注入权限...')
  const permissionTree = pmsToTree(pms, 1, null)
  await permissionTreeIntoDb(permissionTree)
  console.log('正在清除多余权限...')
  const waitDeleteCodes = oldCodes.filter(code => !newCodes.includes(code))
  await sysPermissionRepository.delete({ code: In(waitDeleteCodes) })
  console.log('同步权限已完成')
})()
  .catch(error => {
    console.log(error)
  })
  .finally(() => {
    process.exit(1)
  })
