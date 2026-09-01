import type { HttpRequest } from '@jying/http'
import type { AdminLoginDto } from '@ying/dto'
import type { AdminAuthVo } from '@ying/vo'
import type { SysUserEntity } from '@ying/entity'

export default function (http: HttpRequest) {
  return {
    login(data: AdminLoginDto) {
      return http.post<AdminAuthVo>('/sys/auth/login', { data })
    },
    logout() {
      return http.get('/sys/auth/logout')
    },
    getUserInfo() {
      return http.get<SysUserEntity>('/sys/auth/user')
    }
  }
}
