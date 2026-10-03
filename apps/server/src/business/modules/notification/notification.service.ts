import { eq } from 'drizzle-orm'
import type { PushSubscription } from 'web-push'
import { match as langMatch } from '@formatjs/intl-localematcher'
import { PushTaskStatus, clientLanguagesConfig } from '@ying/shared'
import type { LngKeys, SetPushTaskDto, SendPushTemplateDto, PushData } from '@ying/shared'
import { pushTaskTable } from '@ying/db-drizzle/schema'
import { db } from '@/common/modules/db'
import { pushService } from '@/common/modules/push'
import { redis } from '@/common/modules/redis'
import { notificationQueue } from './notification.queue'

const fallbackLng = clientLanguagesConfig.fallbackLng

export class NotificationService {
  sendPushData(pushSubscription: PushSubscription, pushData: PushData & { pushRecordId?: number }) {
    return pushService.sendNotification(pushSubscription, JSON.stringify(pushData))
  }

  async getVisitorAndPushTemplate(visitorId: string, pushTemplateId: number) {
    const visitor = await db.query.visitorTable.findFirst({
      where: {
        id: visitorId
      }
    })
    if (!visitor || !visitor.pushSubscription) throw Error
    const pushTemplate = await db.query.pushTemplateTable.findFirst({
      where: { id: pushTemplateId },
      with: {
        image: true
      }
    })
    if (!pushTemplate) throw Error
    return {
      visitor,
      pushTemplate
    }
  }

  getPushData({ visitor, pushTemplate }: Awaited<ReturnType<typeof this.getVisitorAndPushTemplate>>) {
    const userLanguages = visitor.languages ?? []
    const pushData: PushData = {
      title:
        pushTemplate.title[langMatch(userLanguages, Object.keys(pushTemplate.title), fallbackLng) as LngKeys] ??
        'title',
      body: pushTemplate.body
        ? pushTemplate.body[langMatch(userLanguages, Object.keys(pushTemplate.body), fallbackLng) as LngKeys]
        : undefined,
      link: pushTemplate.link ?? undefined,
      image: pushTemplate.image?.url ?? undefined,
      actions:
        pushTemplate.actions?.map(el => {
          return {
            title: el.title[langMatch(userLanguages, Object.keys(el.title), fallbackLng) as LngKeys] ?? 'title',
            link: el.link ?? undefined
          }
        }) ?? undefined
    }
    return pushData
  }

  async sendNotification(dto: SendPushTemplateDto) {
    const data = await this.getVisitorAndPushTemplate(dto.visitorId, dto.pushTemplateId)
    return this.sendPushData(data.visitor.pushSubscription!, this.getPushData(data))
  }

  async executePushTask(id: number) {
    const pushTask = await db.query.pushTaskTable.findFirst({
      where: { id },
      with: {
        pushTemplate: {
          with: {
            image: true
          }
        }
      }
    })
    if (!pushTask) return
    if (pushTask.status === PushTaskStatus.Executing) return

    const visitors = await db.query.visitorTable.findMany({
      where: {
        deviceType: pushTask.deviceType ? pushTask.deviceType : undefined,
        pushSubscription: {
          isNotNull: true
        }
      }
    })

    await db.update(pushTaskTable).set({ status: PushTaskStatus.Executing }).where(eq(pushTaskTable.id, pushTask.id))
    if (!visitors.length) {
      await db.update(pushTaskTable).set({ status: PushTaskStatus.Done }).where(eq(pushTaskTable.id, pushTask.id))
      return
    }

    await redis.set(`push_task_${pushTask.id}_process_length`, visitors.length)

    visitors.forEach(visitor => {
      if (!visitor.pushSubscription) return
      void notificationQueue.add(
        'pushRecord',
        {
          visitorId: visitor.id,
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
      await db
        .update(pushTaskTable)
        .set({
          status: PushTaskStatus.WaitExecute,
          time: new Date(dto.time)
        })
        .where(eq(pushTaskTable.id, dto.id))
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
    await db.update(pushTaskTable).set({ status: PushTaskStatus.Wait, time: null }).where(eq(pushTaskTable.id, id))
  }
}
