import type { HttpRequest } from '@jying/http'
import type { AdminLoginDto, UpdateSysUserSelfPasswordDto, UpdateSysUserSelfUserInfoDto } from '@ying/shared'
import type { SysAuthLoginVo, SysAuthUserInfoVo } from '@ying/server/types-admin'

export default function (http: HttpRequest) {
  return {
    login(data: AdminLoginDto) {
      return http.post<SysAuthLoginVo>('/sys-auth/login', { data })
    },
    logout() {
      return http.get<void>('/sys-auth/logout')
    },
    getUserInfo() {
      return http.get<SysAuthUserInfoVo>('/sys-auth/user-info')
    },
    updateUserInfo(data: UpdateSysUserSelfUserInfoDto) {
      return http.put<void>('/sys-auth/user-info', { data })
    },
    updateUserPassword(data: UpdateSysUserSelfPasswordDto) {
      return http.put<void>('/sys-auth/user-password', { data })
    }
  }
}
