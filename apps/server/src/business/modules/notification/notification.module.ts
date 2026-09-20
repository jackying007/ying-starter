import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BullModule } from '@nestjs/bullmq'

import { VisitorEntity, PushTemplateEntity, PushTaskEntity, PushRecordEntity, UserEntity } from '@ying/shared'

import { VisitorService } from './visitor.service'
import { PushTemplateService } from './push.template.service'
import { PushTaskService } from './push.task.service'
import { PushRecordService } from './push.record.service'
import { NotificationService } from './notification.service'
import { NotificationConsumer } from './notification.consumer'

const enableConsumer = !!process.env.ENABLE_CONSUMER

@Module({
  imports: [
    TypeOrmModule.forFeature([VisitorEntity, UserEntity, PushTemplateEntity, PushTaskEntity, PushRecordEntity]),
    BullModule.registerQueue({
      name: 'notification'
    })
  ],
  providers: [
    VisitorService,
    PushTemplateService,
    PushTaskService,
    PushRecordService,
    NotificationService,
    ...(enableConsumer ? [NotificationConsumer] : [])
  ],
  exports: [VisitorService, PushTemplateService, PushTaskService, PushRecordService, NotificationService]
})
export class NotificationModule {}
