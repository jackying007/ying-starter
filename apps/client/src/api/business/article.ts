import type { HttpRequest } from '@jying/http'
import type { ListArticleDto } from '@ying/shared'
import type { ArticleListVo, ArticleVo } from '@ying/server/types-client'

export default function (http: HttpRequest) {
  return {
    list(query?: ListArticleDto) {
      return http.get<ArticleListVo>('/article/list', { query })
    },
    listCount() {
      return http.get<number>('/article/list-count')
    },
    detail(id: number) {
      return http.get<ArticleVo>(`/article/${id}`)
    },
    view(id: number) {
      return http.get<void>(`/article/${id}/view`)
    }
  }
}
