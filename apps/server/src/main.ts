import { Hono } from 'hono'
import { serveStatic } from '@hono/node-server/serve-static'
import { serve } from '@hono/node-server'
import { styleText } from 'util'

import { apiConfig } from '@/config'
import { admin, initSocketIo as initAdminSocketIo } from '@/business/admin'
import { client } from '@/business/client'

import { processTimeMiddleware } from './app.middleware'
import { appErrorHandler } from './app.error.handler'
import { appLogger } from './app.logger'

const app = new Hono()
app.use(
  '/storage/*',
  serveStatic({
    root: './storage', // 相对启动路径
    rewriteRequestPath: path => path.replace(/^\/storage/, '')
  })
)

const appAPI = new Hono()
appAPI.use(processTimeMiddleware)
appAPI.onError(appErrorHandler)
appAPI.route('/admin', admin)
appAPI.route('/client', client)

app.route('/api', appAPI)

const httpServer = serve(
  {
    fetch: app.fetch,
    hostname: '0.0.0.0',
    port: apiConfig.port
  },
  () => appLogger.log(`🚀 Application is running on ${styleText('cyanBright', apiConfig.serverUrl)}`)
)

initAdminSocketIo(httpServer)

if (apiConfig.enableConsumer) import('./worker')
