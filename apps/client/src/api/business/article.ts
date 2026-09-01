import type { HttpRequest } from '@jying/http'
import type { ListArticleDto } from '@ying/dto'
import type { ArticleEntity } from '@ying/entity'

export default function (http: HttpRequest) {
  return {
    list(query?: ListArticleDto) {
      return http.get<ArticleEntity[]>('/article/list', { query })
    },
    listCount() {
      return http.get<number>('/article/list-count')
    },
    detail(id: number) {
      return http.get<ArticleEntity>(`/article/${id}`)
    },
    view(id: number) {
      return http.get<void>(`/article/${id}/view`)
    }
  }
}
