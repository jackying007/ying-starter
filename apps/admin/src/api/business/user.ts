import { HttpRequest } from '@jying/http'
import type { ListUserDto, StatDto } from '@ying/shared'
import type { UserListVo, UserStatByTypeVo, UserStatVo } from '@ying/server/types-admin'
import { timeDataTransform } from '../helpers'

export default function (http: HttpRequest) {
  return {
    list(query: ListUserDto) {
      return http.get<UserListVo>('/user/list', { query: timeDataTransform(query, 'date') })
    },
    listCount(query: ListUserDto) {
      return http.get<number>('/user/list-count', { query: timeDataTransform(query, 'date') })
    },
    export(query: ListUserDto) {
      return http.get('/user/export', { query: timeDataTransform(query, 'date'), responseType: 'raw' })
    },
    getUserGrowthTotal() {
      return http.get<number>('/user-stat/growth-total')
    },
    getUserGrowthTrendAll(query: StatDto) {
      return http.get<UserStatVo>('/user-stat/growth-trend-all', { query })
    },
    getUserGrowthTrend(query: StatDto) {
      return http.get<UserStatByTypeVo>('/user-stat/growth-trend', { query })
    }
  }
}
