import { parseArgs } from 'node:util'
import { createHash } from 'node:crypto'
import { faker } from '@faker-js/faker'
import { FileSourceType, FileType } from '@ying/shared'
import { db } from './db'
import { sysRoleTable, sysRoleToSysUserTable, sysUserTable, fileTable } from '../src/schema'

export function generatePass(pass: string) {
  const sha1 = createHash('sha1')
  const ciphertext = sha1.update(pass).digest('hex')
  return ciphertext
}

void (async function () {
  const { values } = parseArgs({
    options: {
      account: { type: 'string', short: 'a', default: 'admin' },
      pass: { type: 'string', short: 'p', default: 'Admin.123' }
    },
    allowPositionals: true
  })

  const sysUser = await db.query.sysUserTable.findFirst({
    where: {
      account: values.account
    }
  })
  if (!sysUser) {
    let sysRole = await db.query.sysRoleTable.findFirst({
      where: {
        name: 'Super Admin'
      }
    })
    if (!sysRole) {
      console.log('正在创建超级管理员角色')

      ;[sysRole] = await db
        .insert(sysRoleTable)
        .values({
          name: 'Super Admin',
          systemic: true,
          remark: 'super admin role'
        })
        .returning()

      console.log('超级管理员角色创建完毕')
    }

    console.log('正在创建超级管理员账号')
    const [sysUser] = await db
      .insert(sysUserTable)
      .values({
        name: faker.person.fullName() ?? values.account,
        account: values.account,
        password: generatePass(values.pass),
        remark: 'super admin account'
      })
      .returning()
    await db.insert(sysRoleToSysUserTable).values({
      sysRoleId: sysRole.id,
      sysUserId: sysUser.id
    })

    const avatarUrl = faker.image.avatar()
    let superAdminAvatar = await db.query.fileTable.findFirst({
      where: {
        url: avatarUrl
      }
    })
    if (!superAdminAvatar) {
      ;[superAdminAvatar] = await db
        .insert(fileTable)
        .values({
          type: FileType.Image,
          from: FileSourceType.Admin,
          isExternal: true,
          userId: sysUser.id,
          path: avatarUrl,
          url: avatarUrl
        })
        .returning()
    }
    await db.update(sysUserTable).set({
      avatarId: superAdminAvatar.id
    })
    console.log('超级管理员账号创建完毕')
  } else {
    console.log('账号已存在')
  }
})()
  .catch(error => {
    console.log(error)
  })
  .finally(() => {
    process.exit(1)
  })
