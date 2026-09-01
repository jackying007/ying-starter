import { HttpRequest } from '@jying/http'
import { isBaseVo } from '@ying/vo'
import { clearUserInfoAndAuthTokens } from '@/store/auth-store'
import { HttpError } from './http-error'
import { isRefreshRequest, refreshToken } from './refresh-token'

export const http = new HttpRequest({
  baseURL: import.meta.env.APP_API_BASE
})

http.addHooks({
  afterResponse: ({ type, data }) => {
    if (type === 'json' && isBaseVo(data)) return data.data
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
    if (fetchRes.status === 401) clearUserInfoAndAuthTokens()
    return fetchRes.json().then(
      res =>
        new HttpError(res, {
          status: fetchRes.status,
          statusText: fetchRes.statusText
        })
    )
  }
})
