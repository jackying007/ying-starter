import type { HttpRequest } from '@jying/http'
import type { CreateOrUpdateArticleDto, UpdateArticleContentDto, ListArticleDto, DeleteDto } from '@ying/shared'
import type { ArticleListVo, ArticleVo } from '@ying/server/types-admin'
import { timeDataTransform } from '../helpers'

export default function (http: HttpRequest) {
  return {
    list(query: ListArticleDto) {
      return http.get<ArticleListVo>('/article/list', { query: timeDataTransform(query, 'date') })
    },
    listCount(query: ListArticleDto) {
      return http.get<number>('/article/list-count', { query: timeDataTransform(query, 'date') })
    },
    create(data: CreateOrUpdateArticleDto) {
      return http.post<void>('/article', { data })
    },
    update(data: CreateOrUpdateArticleDto) {
      return http.put<void>('/article', { data })
    },
    updateContent(data: UpdateArticleContentDto) {
      return http.put<void>('/article/content', { data })
    },
    del(data: DeleteDto) {
      return http.delete<void>('/article', { data })
    },
    detail(id: number) {
      return http.get<ArticleVo>(`/article/${id}`)
    }
  }
}
