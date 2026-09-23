import type { Job } from 'bullmq'

export type NotificationJobMap = {
  pushRecord: {
    visitorId: string
    pushTaskId: number
  }
  pushTask: {
    pushTaskId: number
  }
}

export type NotificationJobName = keyof NotificationJobMap

export type NotificationJobData = NotificationJobMap[NotificationJobName]

export type NotificationJobs = {
  [K in NotificationJobName]: Job<NotificationJobMap[K], void, K>
}[NotificationJobName]
