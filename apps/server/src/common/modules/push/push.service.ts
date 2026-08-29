import { Inject, Injectable, Logger } from '@nestjs/common'
import type { ConfigType } from '@nestjs/config'
import type { PushSubscription } from 'web-push'
import * as webpush from 'web-push'

import { pushConfig } from '@/config'

@Injectable()
export class PushService {
  constructor(
    @Inject(pushConfig.KEY)
    private readonly pushConf: ConfigType<typeof pushConfig>
  ) {
    if (!this.pushConf.subject || !this.pushConf.publicKey || !this.pushConf.privateKey) {
      Logger.warn('PushService is not ready.')
      return
    }
    webpush.setVapidDetails(this.pushConf.subject, this.pushConf.publicKey, this.pushConf.privateKey)
  }

  async sendNotification(pushSubscription: PushSubscription, content: string) {
    return webpush.sendNotification(pushSubscription, content)
  }
}
