import type { PushSubscription } from 'web-push'
import webpush from 'web-push'
import { pushConfig } from '@/config'

export class PushService {
  constructor() {
    if (!pushConfig.subject || !pushConfig.publicKey || !pushConfig.privateKey) {
      console.warn('PushService is not ready.')
      return
    }
    webpush.setVapidDetails(pushConfig.subject, pushConfig.publicKey, pushConfig.privateKey)
  }

  async sendNotification(pushSubscription: PushSubscription, content: string) {
    return webpush.sendNotification(pushSubscription, content)
  }
}
