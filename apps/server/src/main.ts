import { Hono } from 'hono'
import { serveStatic } from '@hono/node-server/serve-static'
import { serve } from '@hono/node-server'
import { styleText } from 'util'

import { apiConfig } from '@/config'
import { admin } from '@/business/admin'
import { client } from '@/business/client'

import { processTimeMiddleware } from './app.middleware'
import { appErrorHandler } from './app.error.handler'
import { appLogger } from './app.logger'

const app = new Hono()
app.use('/storage/*', serveStatic({ root: './storage', rewriteRequestPath: path => path.replace(/^\/storage/, '') }))

const appAPI = new Hono()
appAPI.use(processTimeMiddleware)
appAPI.onError(appErrorHandler)
appAPI.route('/admin', admin)
appAPI.route('/client', client)

app.route('/api', appAPI)

serve(
  {
    fetch: app.fetch,
    hostname: '0.0.0.0',
    port: apiConfig.port
  },
  () => appLogger.log(`🚀 Application is running on ${styleText('cyanBright', apiConfig.serverUrl)}`)
)

if (apiConfig.enableConsumer) import('./worker')
