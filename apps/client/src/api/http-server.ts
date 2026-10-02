import { createIsomorphicFn } from '@tanstack/react-start'
import { HttpRequest } from '@jying/http'
import { nullToUndefined } from '@ying/utils'
import { HttpError } from './http-error'

const getBaseURL = createIsomorphicFn()
  .server(() => import.meta.env.APP_SERVER_URL + import.meta.env.APP_API_BASE)
  .client(() => import.meta.env.APP_API_BASE)

export const http = new HttpRequest({
  baseURL: getBaseURL()
})

http.addHooks({
  afterResponse: ({ type, data }) => {
    if (type === 'json') return nullToUndefined(data)
    return data
  },
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
