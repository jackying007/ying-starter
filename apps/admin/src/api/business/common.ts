import { HttpRequest } from '@jying/http'
import type { ListFileDto, ListFeedbackDto, TFileExtra } from '@ying/shared'
import type { FileListVo, FileVo, FeedbackListVo } from '@ying/server/types-admin'
import { timeDataTransform } from '../helpers'

export default function (http: HttpRequest) {
  return {
    uploadImage(file: File, extra?: TFileExtra) {
      const form = new FormData()
      form.append('file', file)
      form.append('extra', JSON.stringify(extra))
      return http.post<FileVo>('/file/image', { body: form })
    },
    listFile(query: ListFileDto) {
      return http.get<FileListVo>('/file/list', { query: timeDataTransform(query, 'date') })
    },
    listFileCount(query: ListFileDto) {
      return http.get<number>('/file/list-count', { query: timeDataTransform(query, 'date') })
    },
    deleteFile(id: number) {
      return http.delete<void>(`/file/${id}`)
    },
    listFeedback(query: ListFeedbackDto) {
      return http.get<FeedbackListVo>('/feedback/list', { query: timeDataTransform(query, 'date') })
    },
    listFeedbackCount(query: ListFeedbackDto): Promise<number> {
      return http.get<number>('/feedback/list-count', { query: timeDataTransform(query, 'date') })
    },
    deleteFeedback(id: number) {
      return http.delete<void>(`/feedback/${id}`)
    }
  }
}
