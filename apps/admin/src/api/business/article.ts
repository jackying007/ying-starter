import type { HttpRequest } from '@jying/http'
import type {
  CreateArticleDto,
  UpdateArticleDto,
  UpdateArticleContentDto,
  ListArticleDto,
  DeleteDto
} from '@ying/shared/dto'
import type { ArticleEntity } from '@ying/shared/entity'

import { timeDataTransform } from '../helpers'

export default function (http: HttpRequest) {
  return {
    list(query: ListArticleDto) {
      return http.get<ArticleEntity[]>('/article/list', { query: timeDataTransform(query, 'date') })
    },
    listCount(query: ListArticleDto) {
      return http.get<number>('/article/list-count', { query: timeDataTransform(query, 'date') })
    },
    create(data: CreateArticleDto) {
      return http.post<void>('/article', { data })
    },
    update(data: UpdateArticleDto) {
      return http.put<void>('/article', { data })
    },
    updateContent(data: UpdateArticleContentDto) {
      return http.put<void>('/article/content', { data })
    },
    del(data: DeleteDto) {
      return http.delete<void>('/article', { data })
    },
    detail(id: number) {
      return http.get<ArticleEntity>(`/article/${id}`)
    }
  }
}
