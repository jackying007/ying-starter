import { HttpRequest } from '@jying/http'
import { isBaseVo } from '@ying/shared/vo'

export const http = new HttpRequest({
  baseURL: import.meta.env.APP_SERVER_URL + import.meta.env.APP_API_BASE
})

http.addHooks({
  afterResponse: ({ type, data }) => {
    if (type === 'json' && isBaseVo(data)) return data.data
    return data
  }
})
