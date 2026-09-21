import { Worker } from 'bullmq'
import { redis } from '@/common/modules/redis'
import type { NotificationJobs } from './notification-types'
import { notificationConsumer } from '.'

export const notificationWorker = new Worker(
  'notification',
  job => notificationConsumer.process(job as NotificationJobs),
  {
    connection: redis
  }
)
