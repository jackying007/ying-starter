import { eq } from 'drizzle-orm'
import { WebPushError } from 'web-push'
import { PushRecordStatus, PushTaskStatus } from '@ying/shared'
import { visitorTable, pushTaskTable, pushRecordTable } from '@ying/db-drizzle/schema'
import { db } from '@/common/modules/db'
import { redis } from '@/common/modules/redis'
import type { NotificationJobMap, NotificationJobs } from './notification.types'
import { notificationService } from '.'

export class NotificationConsumer {
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
    let pushRecord: typeof pushRecordTable.$inferSelect | undefined
    try {
      const [visitor, pushTask] = await Promise.all([
        db.query.visitorTable.findFirst({ where: { id: visitorId } }),
        db.query.pushTaskTable.findFirst({
          where: { id: pushTaskId },
          with: {
            pushTemplate: {
              with: {
                image: true
              }
            }
          }
        })
      ])
      if (!visitor?.pushSubscription || !pushTask?.pushTemplate) return
      const pushData = notificationService.getPushData({ visitor, pushTemplate: pushTask.pushTemplate })
      ;[pushRecord] = await db
        .insert(pushRecordTable)
        .values({
          visitorId,
          pushTaskId,
          pushData
        })
        .returning()

      await notificationService.sendPushData(visitor.pushSubscription, {
        pushRecordId: pushRecord.id,
        ...pushData
      })

      await db
        .update(pushRecordTable)
        .set({
          status: PushRecordStatus.Success
        })
        .where(eq(pushRecordTable.id, pushRecord.id))
    } catch (error) {
      if (!pushRecord) return
      let errorResult: string
      if (error instanceof WebPushError) {
        errorResult = JSON.stringify(error)
        if (error.statusCode === 410) {
          await db.update(visitorTable).set({ pushSubscription: null }).where(eq(visitorTable.id, pushRecord.visitorId))
        }
      } else {
        errorResult = String(error)
      }
      await db
        .update(pushRecordTable)
        .set({
          pushResult: errorResult,
          status: PushRecordStatus.Fail
        })
        .where(eq(pushRecordTable.id, pushRecord.id))
    } finally {
      let processLength = Number(await redis.get(`push_task_${pushTaskId}_process_length`))
      processLength = processLength - 1
      if (processLength === 0) {
        await db.update(pushTaskTable).set({ status: PushTaskStatus.Done }).where(eq(pushTaskTable.id, pushTaskId))
        await redis.del(`push_task_${pushTaskId}_process_length`)
      } else {
        await redis.set(`push_task_${pushTaskId}_process_length`, processLength)
      }
    }
  }

  async handlePushTask(data: NotificationJobMap['pushTask']) {
    const { pushTaskId } = data
    await notificationService.executePushTask(pushTaskId)
  }
}
