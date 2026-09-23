import { IsNull, Not, Repository } from 'typeorm'
import type { PushSubscription } from 'web-push'
import { match as langMatch } from '@formatjs/intl-localematcher'
import { PushTaskStatus, clientLanguagesConfig } from '@ying/shared'
import type { LngKeys, SetPushTaskDto, SendPushTemplateDto, PushData } from '@ying/shared'
import { VisitorEntity, PushTemplateEntity, PushTaskEntity } from '@ying/db-typeorm'
import { dataSource } from '@/common/modules/db'
import { pushService } from '@/common/modules/push'
import { redis } from '@/common/modules/redis'
import { notificationQueue } from './notification.queue'

const fallbackLng = clientLanguagesConfig.fallbackLng

export class NotificationService {
  private readonly visitorRepository: Repository<VisitorEntity>
  private readonly pushTemplateRepository: Repository<PushTemplateEntity>
  private readonly pushTaskRepository: Repository<PushTaskEntity>
  constructor() {
    this.visitorRepository = dataSource.getRepository(VisitorEntity)
    this.pushTemplateRepository = dataSource.getRepository(PushTemplateEntity)
    this.pushTaskRepository = dataSource.getRepository(PushTaskEntity)
  }

  sendPushData(pushSubscription: PushSubscription, pushData: PushData & { pushRecordId?: number }) {
    return pushService.sendNotification(pushSubscription, JSON.stringify(pushData))
  }

  getPushData(visitor: VisitorEntity, pushTemplate: PushTemplateEntity) {
    const userLanguages = visitor.languages ?? []
    const pushData: PushData = {
      title:
        pushTemplate.title[langMatch(userLanguages, Object.keys(pushTemplate.title), fallbackLng) as LngKeys] ??
        'title',
      body: pushTemplate.body
        ? pushTemplate.body[langMatch(userLanguages, Object.keys(pushTemplate.body), fallbackLng) as LngKeys]
        : undefined,
      link: pushTemplate.link,
      image: pushTemplate.image?.url,
      actions: pushTemplate.actions?.map(el => {
        return {
          title: el.title[langMatch(userLanguages, Object.keys(el.title), fallbackLng) as LngKeys] ?? 'title',
          link: el.link
        }
      })
    }
    return pushData
  }

  async sendNotification(dto: SendPushTemplateDto) {
    const visitor = await this.visitorRepository.findOneBy({
      visitorId: dto.visitorId
    })
    if (!visitor || !visitor.pushSubscription) return
    const pushTemplate = await this.pushTemplateRepository.findOne({
      where: { id: dto.pushTemplateId },
      relations: {
        image: true
      }
    })
    if (!pushTemplate) return
    return this.sendPushData(visitor.pushSubscription, this.getPushData(visitor, pushTemplate))
  }

  async executePushTask(id: number) {
    const pushTask = await this.pushTaskRepository.findOne({
      where: { id },
      relations: {
        pushTemplate: {
          image: true
        }
      }
    })
    if (!pushTask) return
    if (pushTask.status === PushTaskStatus.Executing) return

    const visitors = await this.visitorRepository.find({
      where: { deviceType: pushTask.deviceType, pushSubscription: Not(IsNull()) }
    })

    pushTask.status = PushTaskStatus.Executing
    await this.pushTaskRepository.save(pushTask)

    if (!visitors.length) {
      await this.pushTaskRepository.update(pushTask.id, { status: PushTaskStatus.Done })
      return
    }

    await redis.set(`push_task_${pushTask.id}_process_length`, visitors.length)

    visitors.forEach(visitor => {
      if (!visitor.pushSubscription) return
      void notificationQueue.add(
        'pushRecord',
        {
          visitorId: visitor.visitorId,
          pushTaskId: pushTask.id
        },
        { removeOnComplete: true }
      )
    })
  }

  async setPuskTask(dto: SetPushTaskDto) {
    if (!dto.time) {
      await this.executePushTask(dto.id)
    } else {
      await this.pushTaskRepository.update(dto.id, { status: PushTaskStatus.WaitExecute, time: dto.time })
      void this.executePushTaskByTiming(dto)
    }
  }

  async executePushTaskByTiming(dto: SetPushTaskDto) {
    await notificationQueue.add(
      'pushTask',
      {
        pushTaskId: dto.id
      },
      {
        jobId: `pushTask_${dto.id}`,
        delay: dto.time ? new Date(dto.time).getTime() - Date.now() : undefined,
        removeOnComplete: true
      }
    )
  }

  async stopTimingPushTask(id: number) {
    await notificationQueue.remove(`pushTask_${id}`)
    await this.pushTaskRepository.update(id, { status: PushTaskStatus.Wait, time: null })
  }
}
