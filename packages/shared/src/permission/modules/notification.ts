import { genneratePermission as GP } from '../type'

export const notification = GP('通知管理', {
  pushTemplate: GP('推送模板', {
    create: GP('创建推送模板'),
    update: GP('更新推送模板'),
    delete: GP('删除推送模板'),
    send: GP('发送推送模板')
  }),
  pushTask: GP('推送任务', {
    create: GP('创建推送任务'),
    update: GP('更新推送任务'),
    delete: GP('删除推送任务'),
    setUp: GP('设置推送任务'),
    stopTiming: GP('停止定时推送')
  }),
  pushRecord: GP('推送记录'),
  visitor: GP('浏览用户', {
    delete: GP('删除浏览用户')
  })
})
