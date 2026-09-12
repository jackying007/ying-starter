import { parseArgs } from 'node:util'
import { faker } from '@faker-js/faker'
import { FileSourceType, FileType } from '@ying/shared'
import { SysRoleEntity, SysUserEntity, FileEntity } from '@ying/shared/entity'
import { generatePass } from '../src/common/utils'
import dataSource from '../typeorm.config'

void (async function () {
  const { values } = parseArgs({
    options: {
      account: { type: 'string', short: 'a', default: 'admin' },
      pass: { type: 'string', short: 'p', default: 'Admin.123' }
    },
    allowPositionals: true
  })

  await dataSource.initialize()
  const sysUserRepository = dataSource.getRepository(SysUserEntity)
  const sysRoleRepository = dataSource.getRepository(SysRoleEntity)
  const fileRepository = dataSource.getRepository(FileEntity)

  const sysUser = await sysUserRepository.findOneBy({
    account: values.account
  })
  if (!sysUser) {
    let sysRole = await sysRoleRepository.findOneBy({
      name: 'Super Admin'
    })
    if (!sysRole) {
      console.log('正在创建超级管理员角色')
      sysRole = sysRoleRepository.create({
        name: 'Super Admin',
        systemic: true,
        remark: 'super admin role'
      })
      await sysRoleRepository.save(sysRole)
      console.log('超级管理员角色创建完毕')
    }

    console.log('正在创建超级管理员账号')
    const sysUser = sysUserRepository.create({
      name: faker.person.fullName() ?? values.account,
      account: values.account,
      password: generatePass(values.pass),
      remark: 'super admin account',
      roles: [sysRole]
    })
    await sysUserRepository.save(sysUser)

    const avatarUrl = faker.image.avatar()
    let superAdminAvatar = await fileRepository.findOneBy({
      url: avatarUrl
    })
    if (!superAdminAvatar) {
      superAdminAvatar = fileRepository.create({
        type: FileType.Image,
        from: FileSourceType.Admin,
        isExternal: true,
        userId: sysUser.id,
        path: avatarUrl,
        url: avatarUrl
      })
      await fileRepository.save(superAdminAvatar)
    }
    sysUser.avatar = superAdminAvatar
    await sysUserRepository.save(sysUser)

    console.log('超级管理员账号创建完毕')
  } else {
    console.log('账号已存在')
  }
})().finally(() => {
  process.exit(1)
})
