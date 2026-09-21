import { Repository } from 'typeorm'
import { WebPushError } from 'web-push'
import { PushRecordStatus, PushTaskStatus, PushRecordEntity, PushTaskEntity, VisitorEntity } from '@ying/shared'
import { dataSource } from '@/common/modules/db'
import { redis } from '@/common/modules/redis'
import type { NotificationJobMap, NotificationJobs } from './notification-types'
import { notificationService } from '.'

export class NotificationConsumer {
  private readonly visitorRepository: Repository<VisitorEntity>
  private readonly pushTaskRepository: Repository<PushTaskEntity>
  private readonly pushRecordRepository: Repository<PushRecordEntity>
  constructor() {
    this.visitorRepository = dataSource.getRepository(VisitorEntity)
    this.pushTaskRepository = dataSource.getRepository(PushTaskEntity)
    this.pushRecordRepository = dataSource.getRepository(PushRecordEntity)
  }

  async process(job: NotificationJobs) {
    switch (job.name) {
      case 'pushTask':
        await this.handlePushTask(job.data)
        break
      case 'pushRecord':
        await this.handlePushRecord(job.data)
        break
      default:
        // 理论上不会进入这里。
        // 如果以后 NotificationJobMap 新增任务，
        // TypeScript 可以帮助你发现这里需要处理。
        const _exhaustiveCheck: never = job
        throw new Error(`Unknown job: ${_exhaustiveCheck}`)
    }
  }

  async handlePushRecord(data: NotificationJobMap['pushRecord']) {
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
      const pushData = notificationService.getPushData(visitor, pushTask.pushTemplate)
      pushRecord = await this.pushRecordRepository.save(
        this.pushRecordRepository.create({
          visitorId,
          pushTaskId,
          pushData
        })
      )
      if (!pushRecord) return
      await notificationService.sendPushData(visitor.pushSubscription, {
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

  async handlePushTask(data: NotificationJobMap['pushTask']) {
    const { pushTaskId } = data
    await notificationService.executePushTask(pushTaskId)
    return
  }
}
