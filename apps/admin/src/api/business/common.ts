import { HttpRequest } from '@jying/http'
import type { ListFileDto, ListFeedbackDto } from '@ying/shared'
import type { FileEntity, TFileExtra, FeedbackEntity } from '@ying/shared'
import type { ConfigVo } from '@ying/shared'

import { timeDataTransform } from '../helpers'

export default function (http: HttpRequest) {
  return {
    getConfig() {
      return http.get<ConfigVo>('/config')
    },
    uploadImage(file: File, extra?: TFileExtra) {
      const form = new FormData()
      form.append('file', file)
      form.append('extra', JSON.stringify(extra))
      return http.post<FileEntity>('/file/image', { body: form })
    },
    listFile(query: ListFileDto) {
      return http.get<FileEntity[]>('/file/list', { query: timeDataTransform(query, 'date') })
    },
    listFileCount(query: ListFileDto) {
      return http.get<number>('/file/list-count', { query: timeDataTransform(query, 'date') })
    },
    deleteFile(id: number) {
      return http.delete(`/file/${id}`)
    },
    listFeedback(query: ListFeedbackDto): Promise<FeedbackEntity[]> {
      return http.get('/feedback/list', { query: timeDataTransform(query, 'date') })
    },
    listFeedbackCount(query: ListFeedbackDto): Promise<number> {
      return http.get('/feedback/list-count', { query: timeDataTransform(query, 'date') })
    },
    deleteFeedback(id: number) {
      return http.delete(`/feedback/${id}`)
    }
  }
}
