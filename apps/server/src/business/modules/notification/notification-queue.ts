import { Queue } from 'bullmq'
import { redis } from '@/common/modules/redis'
import type { NotificationJobs } from './notification-types'

export const notificationQueue = new Queue<NotificationJobs>('notification', {
  connection: redis
})
