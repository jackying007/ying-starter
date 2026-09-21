import { HttpRequest, type BeforeRequestHookOptions } from '@jying/http'
import { updateAccessToken } from '@/store/auth-store'

let refreshTokenPromise: Promise<string> | undefined

export function refreshToken(http: HttpRequest) {
  if (refreshTokenPromise) return refreshTokenPromise
  refreshTokenPromise = new Promise((resolve, reject) => {
    http
      .get<string>('/auth/refresh', {
        additional: {
          __isRefreshToken: true
        }
      })
      .then(accessToken => {
        updateAccessToken(accessToken)
        resolve(accessToken)
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
