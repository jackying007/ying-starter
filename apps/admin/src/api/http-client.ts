import { HttpRequest } from '@jying/http'
import { nullToUndefined } from '@ying/utils'
import { clearUserStore } from '@/store'
import { globalEvent } from '@/event-emitter'
import { isRefreshRequest, refreshToken } from './refresh-token'
import { HttpError } from './http-error'

export const http = new HttpRequest({
  baseURL: import.meta.env.APP_API_BASE
})

http.addHooks({
  afterResponse: ({ type, data }) => {
    if (type === 'json') return nullToUndefined(data)
    return data
  },
  beforeError: async (fetchRes, options) => {
    if (fetchRes.status === 401 && !isRefreshRequest(options)) {
      await refreshToken(http)
      return http.request({ ...options, responseType: 'raw' })
    }
    return fetchRes
  },
  afterError: async fetchRes => {
    if (fetchRes.status === 401) clearUserStore()
    const message = await fetchRes.text()
    const httpError = new HttpError(message, {
      status: fetchRes.status,
      statusText: fetchRes.statusText
    })
    globalEvent.emit('API_ERROR_MSG', httpError.message)
    return httpError
  }
})
