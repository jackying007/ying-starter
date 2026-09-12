import { genneratePermission as GP } from '../type'

export const sys = GP('系统管理', {
  role: GP('系统角色', {
    create: GP('创建系统角色'),
    update: GP('更新系统角色'),
    delete: GP('删除系统角色')
  }),
  user: GP('系统用户', {
    create: GP('创建系统用户'),
    update: GP('更新系统用户'),
    delete: GP('删除系统用户')
  }),
  setting: GP('系统设置', {
    clearPermissionCache: GP('清除系统权限缓存'),
    clearDriftFile: GP('清除游离文件'),
    updateSetting: GP('更新配置')
  })
})
