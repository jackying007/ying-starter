import type { HttpRequest } from '@jying/http'
import type { ResetPasswordDto, UpdateUserInfoDto } from '@ying/dto'
import type { ClientUserVo } from '@ying/vo'

export default function (http: HttpRequest) {
  return {
    getInfo() {
      return http.get<ClientUserVo>('/user/info')
    },
    updateUserInfo(data: UpdateUserInfoDto) {
      return http.put<void>('/user', { data })
    },
    resetPassword(data: ResetPasswordDto) {
      return http.put<void>('/user/reset-password', { data })
    }
  }
}
