import { HttpRequest } from '@jying/http'
import type { ListRoleDto, CreateOrUpdateRoleDto } from '@ying/shared'
import type { SysRoleListVo, SysPermissionsVo } from '@ying/server/types-admin'
import { timeDataTransform } from '../helpers'

export default function (http: HttpRequest) {
  return {
    list(query: ListRoleDto) {
      return http.get<SysRoleListVo>('/sys-role/list', { query: timeDataTransform(query, 'date') })
    },
    listPermission() {
      return http.get<SysPermissionsVo>('/sys-role/permissions')
    },
    listCount(query: ListRoleDto) {
      return http.get<number>('/sys-role/list-count', { query: timeDataTransform(query, 'date') })
    },
    create(data: CreateOrUpdateRoleDto) {
      return http.post<void>('/sys-role', { data })
    },
    update(data: CreateOrUpdateRoleDto) {
      return http.put<void>('/sys-role', { data })
    },
    del(id: number) {
      return http.delete<void>(`/sys-role/${id}`)
    }
  }
}
