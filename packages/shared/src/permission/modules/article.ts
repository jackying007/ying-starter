import { genneratePermission as GP } from '../type'

export const article = GP('文章管理', {
  create: GP('创建文章'),
  update: GP('更新文章'),
  updateContent: GP('更新文章内容'),
  delete: GP('删除文章')
})
