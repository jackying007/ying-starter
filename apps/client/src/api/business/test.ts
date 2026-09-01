import type { HttpRequest } from '@jying/http'
import type { ClientLoginDto } from '@ying/dto'

export default function (http: HttpRequest) {
  return {
    gtest() {
      return http.get<number>('/test')
    },
    ptest(data: ClientLoginDto) {
      return http.post<void>('/test', { data })
    }
  }
}
