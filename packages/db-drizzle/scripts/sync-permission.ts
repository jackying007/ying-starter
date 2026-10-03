import { eq, inArray } from 'drizzle-orm'
import { pms, type TPermission } from '@ying/shared/permission'
import { db } from './db'
import { sysPermissionTable } from '../src/schema'

type SysPermissionWithChildren = typeof sysPermissionTable.$inferSelect & {
  children: SysPermissionWithChildren[]
}

function pmsToTree(permission: TPermission, sort: number, parentCode: string | null) {
  const arr: SysPermissionWithChildren[] = []
  Object.keys(permission).forEach(key => {
    if (key !== 'label' && key !== 'code') {
      const permissionChild = permission[key] as TPermission
      if (!permissionChild.code) throw new Error('permission code is not exist')
      const sysPermission: Partial<SysPermissionWithChildren> = {
        ...permissionChild,
        sort,
        parentCode,
        children: []
      }
      const children = pmsToTree(permissionChild, sort + 1, permissionChild.code)
      if (children.length) sysPermission.children = children
      arr.push(sysPermission as SysPermissionWithChildren)
    }
  })
  return arr
}

void (async function () {
  console.log('同步权限中...')
  const existPermissions = await db.query.sysPermissionTable.findMany()
  const oldCodes = existPermissions.map(el => el.code)
  const newCodes: string[] = []

  const permissionTreeIntoDb = async (arr: SysPermissionWithChildren[]) => {
    newCodes.push(...arr.map(permission => permission.code))
    await Promise.all(
      arr.map(async permission => {
        if (oldCodes.includes(permission.code)) {
          await db
            .update(sysPermissionTable)
            .set({
              ...permission
            })
            .where(eq(sysPermissionTable.code, permission.code))
        } else {
          await db.insert(sysPermissionTable).values(permission)
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
  await db.delete(sysPermissionTable).where(inArray(sysPermissionTable.code, waitDeleteCodes))
  console.log('同步权限已完成')
})()
  .catch(error => {
    console.log(error)
  })
  .finally(() => {
    process.exit(1)
  })
