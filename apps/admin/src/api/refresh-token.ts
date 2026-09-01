import { type BeforeRequestHookOptions, HttpRequest } from '@jying/http'
import { setAccessToken } from '@/store'

let refreshTokenPromise: Promise<void> | undefined

export function refreshToken(http: HttpRequest) {
  if (refreshTokenPromise) return refreshTokenPromise
  refreshTokenPromise = new Promise((resolve, reject) => {
    http
      .get<string>('/sys/auth/refresh', {
        additional: {
          __isRefreshToken: true
        }
      })
      .then(accessToken => {
        setAccessToken(accessToken)
        resolve()
      })
      .catch(error => {
        console.error(error)
        reject()
      })
      .finally(() => {
        refreshTokenPromise = undefined
      })
  })
  return refreshTokenPromise
}

export function isRefreshRequest(options: BeforeRequestHookOptions) {
  return !!options.additional?.__isRefreshToken
}
