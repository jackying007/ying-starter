import { InjectRepository } from '@nestjs/typeorm'
import { Inject } from '@nestjs/common'
import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Job } from 'bullmq'
import { Repository } from 'typeorm'
import { WebPushError } from 'web-push'
import { Redis } from 'ioredis'

import { PushRecordStatus, PushTaskStatus } from '@ying/shared'
import { PushRecordEntity, PushTaskEntity, VisitorEntity } from '@ying/shared'

import { RedisToken } from '@/common/modules/redis/constant'

import { NotificationService } from './notification.service'

type TPushRecordJobData = {
  visitorId: string
  pushTaskId: number
}

type TPushRecordJob = Job<TPushRecordJobData, void, 'pushRecord'>

type TPushTaskJobData = {
  pushTaskId: number
}

type TPushTaskJob = Job<TPushTaskJobData, void, 'pushTask'>

export type TNotificationJobs = TPushRecordJob | TPushTaskJob

@Processor('notification')
export class NotificationConsumer extends WorkerHost {
  constructor(
    @InjectRepository(PushRecordEntity)
    readonly pushRecordRepository: Repository<PushRecordEntity>,
    @InjectRepository(VisitorEntity)
    readonly visitorRepository: Repository<VisitorEntity>,
    @InjectRepository(PushTaskEntity)
    readonly pushTaskRepository: Repository<PushTaskEntity>,
    @Inject(RedisToken)
    readonly redis: Redis,
    readonly notificationService: NotificationService
  ) {
    super()
  }

  async process(job: TNotificationJobs) {
    if (job.name === 'pushRecord') {
      await this.handlePushRecord(job.data)
    } else if (job.name === 'pushTask') {
      await this.handlePushTask(job.data)
    }
  }

  async handlePushRecord(data: TPushRecordJobData) {
    const { visitorId, pushTaskId } = data
    let pushRecord: PushRecordEntity | undefined
    try {
      const [visitor, pushTask] = await Promise.all([
        this.visitorRepository.findOne({ where: { visitorId } }),
        this.pushTaskRepository.findOne({
          where: { id: pushTaskId },
          relations: {
            pushTemplate: {
              image: true
            }
          }
        })
      ])
      if (!visitor?.pushSubscription || !pushTask) return
      const pushData = this.notificationService.getPushData(visitor, pushTask.pushTemplate)
      pushRecord = await this.pushRecordRepository.save(
        this.pushRecordRepository.create({
          visitorId,
          pushTaskId,
          pushData
        })
      )
      if (!pushRecord) return
      await this.notificationService.sendPushData(visitor.pushSubscription, {
        pushRecordId: pushRecord.id,
        ...pushData
      })
      pushRecord.status = PushRecordStatus.Success
      await this.pushRecordRepository.save(pushRecord)
    } catch (error) {
      if (!pushRecord) return
      if (error instanceof WebPushError) {
        pushRecord.pushResult = JSON.stringify(error)
        if (error.statusCode === 410) {
          await this.visitorRepository.update(pushRecord.visitorId, { pushSubscription: null })
        }
      } else {
        pushRecord.pushResult = String(error)
      }
      pushRecord.status = PushRecordStatus.Fail
      await this.pushRecordRepository.save(pushRecord)
    } finally {
      const redis = this.redis
      let processLength = Number(await redis.get(`push_task_${pushTaskId}_process_length`))
      if (processLength !== undefined || processLength !== null) {
        processLength = processLength - 1
        await redis.set(`push_task_${pushTaskId}_process_length`, processLength)
        if (processLength === 0) {
          await this.pushTaskRepository.update(pushTaskId, { status: PushTaskStatus.Done })
          await redis.del(`push_task_${pushTaskId}_process_length`)
        }
      }
    }
    return
  }

  async handlePushTask(data: TPushTaskJobData) {
    const { pushTaskId } = data
    await this.notificationService.executePushTask(pushTaskId)
    return
  }
}
