import { Hono } from 'hono'
import { file } from './file'
import { sys } from './sys'
import { feedback } from './feedback'
import { user, userStat } from './user'
import { article } from './article'
import { visitor, pushTemplate, pushTask, pushRecord } from './notification'

export const admin = new Hono()
  .route('/file', file)
  .route('/sys', sys)
  .route('/feedback', feedback)
  .route('/user', user)
  .route('/user-stat', userStat)
  .route('/article', article)
  .route('/visitor', visitor)
  .route('/push-template', pushTemplate)
  .route('/push-task', pushTask)
  .route('/push-record', pushRecord)

export type AdminAPI = typeof admin
