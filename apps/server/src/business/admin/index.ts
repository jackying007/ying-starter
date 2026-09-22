import { Hono } from 'hono'
import { file } from './file'
import { sysAuth, sysRole, sysUser, sysSetting } from './sys'
import { feedback } from './feedback'
import { user, userStat } from './user'
import { article } from './article'
import { visitor, pushTemplate, pushTask, pushRecord } from './notification'

export const admin = new Hono()
  .route('/file', file)
  .route('/sys-auth', sysAuth)
  .route('/sys-role', sysRole)
  .route('/sys-user', sysUser)
  .route('/sys-setting', sysSetting)
  .route('/feedback', feedback)
  .route('/user', user)
  .route('/user-stat', userStat)
  .route('/article', article)
  .route('/visitor', visitor)
  .route('/push-template', pushTemplate)
  .route('/push-task', pushTask)
  .route('/push-record', pushRecord)
