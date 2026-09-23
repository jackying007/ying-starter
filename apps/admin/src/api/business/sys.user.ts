import { HttpRequest } from '@jying/http'
import type { ListSysUserDto, CreateOrUpdateSysUserDto, UpdateSysUserPasswordDto } from '@ying/shared'
import type { SysUserListVo } from '@ying/server/types-admin'
import { timeDataTransform } from '../helpers'

export default function (http: HttpRequest) {
  return {
    list(query: ListSysUserDto) {
      return http.get<SysUserListVo>('/sys-user/list', { query: timeDataTransform(query, 'date') })
    },
    listCount(query: ListSysUserDto) {
      return http.get<number>('/sys-user/list-count', { query: timeDataTransform(query, 'date') })
    },
    create(data: CreateOrUpdateSysUserDto) {
      return http.post<void>('/sys-user', { data })
    },
    update(data: CreateOrUpdateSysUserDto) {
      return http.put<void>('/sys-user', { data })
    },
    del(id: number) {
      return http.delete<void>(`/sys-user/${id}`)
    },
    updatePassword(data: UpdateSysUserPasswordDto) {
      return http.put<void>('/sys-user/password', { data })
    }
  }
}
