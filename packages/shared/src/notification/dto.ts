import { z } from 'zod'

import { listDto, zIntlText, zRequiredString, zRequiredNumber } from '../base'
import { DeviceType } from './enum'

export const listVisitorDto = listDto.extend({
  language: z.string().optional(),
  deviceType: z.enum(DeviceType).optional()
})
export type ListVisitorDto = z.infer<typeof listVisitorDto>

export const createVisitorDto = z.object({
  visitorId: z.string(),
  languages: z.array(z.string()).optional(),
  userAgent: z.string().optional(),
  deviceType: z.string().optional()
})
export type CreateVisitorDto = z.infer<typeof createVisitorDto>

export const listPushTemplateDto = listDto.extend({
  name: z.string().optional(),
  title: z.string().optional()
})
export type ListPushTemplateDto = z.infer<typeof listPushTemplateDto>

export const pushActionDto = z.object({
  title: zIntlText({ minLength: 2, maxLength: 6 }).nonoptional(),
  link: z.string().optional()
})
export type PushActionDto = z.infer<typeof pushActionDto>

export const createOrUpdatePushTemplateDto = z.object({
  id: z.number().optional(),
  name: zRequiredString('模板名称不能为空'),
  title: zIntlText(),
  link: z.string().optional(),
  body: zIntlText({ canEmpty: true }),
  imageId: z.number().nullish(),
  actions: z.array(pushActionDto).optional()
})
export type CreateOrUpdatePushTemplateDto = z.infer<typeof createOrUpdatePushTemplateDto>

export const sendPushTemplateDto = z.object({
  visitorId: z.string().nonempty(),
  pushTemplateId: z.number()
})
export type SendPushTemplateDto = z.infer<typeof sendPushTemplateDto>

export const createOrUpdatePushTaskDto = z.object({
  id: z.number().optional(),
  name: zRequiredString('任务名称不能为空'),
  deviceType: z.string().optional(),
  pushTemplateId: zRequiredNumber('推送模板不能为空')
})
export type CreateOrUpdatePushTaskDto = z.infer<typeof createOrUpdatePushTaskDto>

export const listPushTaskDto = listDto.extend({
  name: z.string().optional()
})
export type ListPushTaskDto = z.infer<typeof listPushTaskDto>

export const setPushTaskDto = z.object({
  id: z.number(),
  time: z.string().optional()
})
export type SetPushTaskDto = z.infer<typeof setPushTaskDto>

export const listPushRecordDto = listDto.extend({
  visitorId: z.string().optional(),
  pushTaskId: z.coerce.number().optional(),
  status: z.coerce.number().optional()
})
export type ListPushRecordDto = z.infer<typeof listPushRecordDto>

const keysDto = z.object({
  p256dh: z.string().nonempty(),
  auth: z.string().nonempty()
})

const subscriptionDto = z.object({
  endpoint: z.string().nonempty(),
  keys: keysDto
})

export const noticeSubscribeDto = z.object({
  visitorId: z.string().nonempty(),
  pushSubscription: subscriptionDto
})
export type NoticeSubscribeDto = z.infer<typeof noticeSubscribeDto>
