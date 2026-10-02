import type { HttpRequest } from '@jying/http'
import type { CreateFeedbackDto, CreateVisitorDto, NoticeSubscribeDto, TFileExtra } from '@ying/shared'
import type { FileVo } from '@ying/server/types-client'

export default function (http: HttpRequest) {
  return {
    createFeedback(data: CreateFeedbackDto) {
      return http.post<void>('/feedback', { data })
    },
    uploadImage(file: File, extra?: TFileExtra) {
      const form = new FormData()
      form.append('file', file)
      form.append('extra', JSON.stringify(extra))
      return http.post<FileVo>('/file/image', { body: form })
    },
    createVisitor(data: CreateVisitorDto) {
      return http.post<void>('/visitor', { data })
    },
    subscribe(data: NoticeSubscribeDto) {
      return http.post<void>('/visitor/subscribe', { data })
    },
    bindUser(id: string) {
      return http.get<void>(`/visitor/${id}/bind`)
    }
  }
}
