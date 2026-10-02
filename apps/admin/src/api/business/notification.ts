import { HttpRequest } from '@jying/http'
import type {
  CreateOrUpdatePushTemplateDto,
  ListPushTemplateDto,
  SendPushTemplateDto,
  CreateOrUpdatePushTaskDto,
  ListPushTaskDto,
  SetPushTaskDto,
  ListPushRecordDto,
  ListVisitorDto
} from '@ying/shared'
import type {
  VisitorListVo,
  PushTemplateListVo,
  SendPushTemplateVo,
  PushTaskListVo,
  PushRecordListVo
} from '@ying/server/types-admin'
import { timeDataTransform } from '../helpers'

export default function (http: HttpRequest) {
  return {
    listVisitor(query: ListVisitorDto) {
      return http.get<VisitorListVo>('/visitor/list', { query: timeDataTransform(query, 'date') })
    },
    listVisitorCount(query: ListVisitorDto) {
      return http.get<number>('/visitor/list-count', { query: timeDataTransform(query, 'date') })
    },
    deleteVisitor(id: string) {
      return http.delete<void>(`/visitor/${id}`)
    },
    createPushTemplate(data: CreateOrUpdatePushTemplateDto) {
      return http.post<void>('/push-template', { data })
    },
    updatePushTemplate(data: CreateOrUpdatePushTemplateDto) {
      return http.put<void>('/push-template', { data })
    },
    deletePushTemplate(id: number) {
      return http.delete<void>(`/push-template/${id}`)
    },
    listPushTemplate(query: ListPushTemplateDto) {
      return http.get<PushTemplateListVo>('/push-template/list', { query: timeDataTransform(query, 'date') })
    },
    listPushTemplateCount(query: ListPushTemplateDto) {
      return http.get<number>('/push-template/list-count', { query: timeDataTransform(query, 'date') })
    },
    sendPushTemplate(data: SendPushTemplateDto) {
      return http.post<SendPushTemplateVo>('/push-template/send', { data })
    },
    createPushTask(data: CreateOrUpdatePushTaskDto) {
      return http.post<void>('/push-task', { data })
    },
    updatePushTask(data: CreateOrUpdatePushTaskDto) {
      return http.put<void>('/push-task', { data })
    },
    deletePushTask(id: number) {
      return http.delete<void>(`/push-task/${id}`)
    },
    listPushTask(query: ListPushTaskDto) {
      return http.get<PushTaskListVo>('/push-task/list', { query: timeDataTransform(query, 'date') })
    },
    listPushTaskCount(query: ListPushTaskDto) {
      return http.get<number>('/push-task/list-count', { query: timeDataTransform(query, 'date') })
    },
    setPushTask(data: SetPushTaskDto) {
      return http.post<void>('/push-task/set-up', { data: timeDataTransform(data, 'time') })
    },
    stopTimingPushTask(id: number) {
      return http.get<void>(`/push-task/${id}/stop-timing`)
    },
    listPushRecord(query: ListPushRecordDto) {
      return http.get<PushRecordListVo>('/push-record/list', { query: timeDataTransform(query, 'date') })
    },
    listPushRecordCount(query: ListPushRecordDto) {
      return http.get<number>('/push-record/list-count', { query: timeDataTransform(query, 'date') })
    }
  }
}
