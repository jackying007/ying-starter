import { HttpRequest } from '@jying/http'
import { isBaseVo } from '@ying/shared'
import { clearUserStore } from '@/store'
import { globalEvent } from '@/event-emitter'
import { isRefreshRequest, refreshToken } from './refresh-token'
import { HttpError } from './http-error'
import { nullToUndefined } from './helpers'

export const http = new HttpRequest({
  baseURL: import.meta.env.APP_API_BASE
})

http.addHooks({
  afterResponse: ({ type, data }) => {
    if (type === 'json' && isBaseVo(data)) return nullToUndefined(data.data)
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
    const errRes = await fetchRes.json()
    const httpError = new HttpError(errRes, {
      status: fetchRes.status,
      statusText: fetchRes.statusText
    })
    globalEvent.emit('API_ERROR_MSG', httpError.message)
    return httpError
  }
})
