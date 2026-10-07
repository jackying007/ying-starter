import { defineMiddleware } from 'nitro'
import { proxyRequest } from 'nitro/h3'

export default defineMiddleware(async (event, next) => {
  if (!event.url.pathname.startsWith(import.meta.env.APP_API_BASE)) return next()
  const proxyUrl = process.env.PROXY_API_URL
  if (!proxyUrl) throw new Error('PROXY_API_URL is not set')
  const target = `${proxyUrl}${event.url.pathname}${event.url.search}`
  return proxyRequest(event, target)
})
