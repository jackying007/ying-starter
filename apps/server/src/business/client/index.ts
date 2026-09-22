import { Hono } from 'hono'
import { common } from './common'
import { auth, oauth } from './auth'
import { user } from './user'
import { article } from './article'
import { visitor } from './visitor'

export const client = new Hono()
  .route('', common)
  .route('/auth', auth)
  .route('/auth', oauth)
  .route('/user', user)
  .route('/article', article)
  .route('/visitor', visitor)
