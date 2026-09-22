import { HttpRequest } from '@jying/http'
import type { CreateRoleDto, ListRoleDto, UpdateRoleDto } from '@ying/shared'
import type { SysRoleEntity, SysPermissionEntity } from '@ying/shared'

import { timeDataTransform } from '../helpers'

export default function (http: HttpRequest) {
  return {
    list(query: ListRoleDto) {
      return http.get<SysRoleEntity[]>('/sys-role/list', { query: timeDataTransform(query, 'date') })
    },
    listPermission() {
      return http.get<SysPermissionEntity[]>('/sys-role/permissions')
    },
    listCount(query: ListRoleDto) {
      return http.get<number>('/sys-role/list-count', { query: timeDataTransform(query, 'date') })
    },
    create(data: CreateRoleDto) {
      return http.post('/sys-role', { data })
    },
    update(data: UpdateRoleDto) {
      return http.put('/sys-role', { data })
    },
    del(id: number) {
      return http.delete(`/sys-role/${id}`)
    }
  }
}
