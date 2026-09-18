import type { HttpRequest } from '@jying/http'
import type { AdminLoginDto, UpdateSysUserSelfPasswordDto, UpdateSysUserSelfUserInfoDto } from '@ying/shared'
import type { AdminAuthVo } from '@ying/shared'
import type { SysUserEntity } from '@ying/shared'

export default function (http: HttpRequest) {
  return {
    login(data: AdminLoginDto) {
      return http.post<AdminAuthVo>('/sys/auth/login', { data })
    },
    logout() {
      return http.get('/sys/auth/logout')
    },
    getUserInfo() {
      return http.get<SysUserEntity>('/sys/auth/user-info')
    },
    updateUserInfo(data: UpdateSysUserSelfUserInfoDto) {
      return http.put('/sys/auth/user-info', { data })
    },
    updateUserPassword(data: UpdateSysUserSelfPasswordDto) {
      return http.put('/sys/auth/user-password', { data })
    }
  }
}
