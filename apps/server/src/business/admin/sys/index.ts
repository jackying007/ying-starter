import { Hono } from 'hono'
import { auth } from './auth'
import { role } from './role'
import { user } from './user'
import { setting } from './setting'

export const sys = new Hono()
sys.route('/auth', auth)
sys.route('/role', role)
sys.route('/user', user)
sys.route('/setting', setting)
