import { genneratePermission as GP } from '../type'

export const file = GP('文件管理', {
  create: GP('创建文件'),
  delete: GP('删除文件')
})
