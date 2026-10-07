import { createIsomorphicFn } from '@tanstack/react-start'
import { HttpRequest } from '@jying/http'
import { HttpError } from './http-error'

const getBaseURL = createIsomorphicFn()
  .server(() => {
    const proxyUrl = process.env.PROXY_API_URL
    if (!proxyUrl) throw new Error('PROXY_API_URL is not set')
    return proxyUrl + import.meta.env.APP_API_BASE
  })
  .client(() => import.meta.env.APP_API_BASE)

export const http = new HttpRequest({
  baseURL: getBaseURL()
})

http.addHooks({
  afterError: async fetchRes => {
    return fetchRes.text().then(
      msg =>
        new HttpError(msg, {
          status: fetchRes.status,
          statusText: fetchRes.statusText
        })
    )
  }
})
