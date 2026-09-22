import { createIsomorphicFn } from '@tanstack/react-start'
import { HttpRequest } from '@jying/http'
import { nullToUndefined } from '@ying/utils'

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
  }
})
