import { VisitorService } from './visitor.service'
import { PushTemplateService } from './push.template.service'
import { PushTaskService } from './push.task.service'
import { PushRecordService } from './push.record.service'
import { NotificationService } from './notification.service'
import { NotificationConsumer } from './notification.consumer'

export const visitorService = new VisitorService()
export const pushTemplateService = new PushTemplateService()
export const pushTaskService = new PushTaskService()
export const pushRecordService = new PushRecordService()
export const notificationService = new NotificationService()
export const notificationConsumer = new NotificationConsumer()
