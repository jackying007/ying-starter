import type { HttpRequest } from '@jying/http'
import type { CreateFeedbackDto, CreateVisitorDto, NoticeSubscribeDto } from '@ying/shared'
import type { FileEntity, TFileExtra, VisitorEntity } from '@ying/shared'

export default function (http: HttpRequest) {
  return {
    createFeedback(data: CreateFeedbackDto) {
      return http.post('/feedback', { data })
    },
    uploadImage(file: File, extra?: TFileExtra) {
      const form = new FormData()
      form.append('file', file)
      form.append('extra', JSON.stringify(extra))
      return http.post<FileEntity>('/file/image', { body: form })
    },
    createVisitor(data: CreateVisitorDto) {
      return http.post('/visitor', { data })
    },
    subscribe(data: NoticeSubscribeDto) {
      return http.post('/visitor/subscribe', { data })
    },
    bindUser(id: string) {
      return http.get<VisitorEntity>(`/visitor/${id}/bind`)
    }
  }
}
