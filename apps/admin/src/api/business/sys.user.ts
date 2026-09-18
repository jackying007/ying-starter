import { HttpRequest } from '@jying/http'
import type { ListSysUserDto, CreateOrUpdateSysUserDto, UpdateSysUserPasswordDto } from '@ying/shared'
import type { SysUserEntity } from '@ying/shared'

import { timeDataTransform } from '../helpers'

export default function (http: HttpRequest) {
  return {
    list(query: ListSysUserDto) {
      return http.get<SysUserEntity[]>('/sys/user/list', { query: timeDataTransform(query, 'date') })
    },
    listCount(query: ListSysUserDto) {
      return http.get<number>('/sys/user/list-count', { query: timeDataTransform(query, 'date') })
    },
    create(data: CreateOrUpdateSysUserDto) {
      return http.post('/sys/user', { data })
    },
    update(data: CreateOrUpdateSysUserDto) {
      return http.put('/sys/user', { data })
    },
    del(id: number) {
      return http.delete(`/sys/user/${id}`)
    },
    updatePassword(data: UpdateSysUserPasswordDto) {
      return http.put('/sys/user/password', { data })
    }
  }
}
