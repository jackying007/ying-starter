/// <reference lib="WebWorker" />
import type { PushData } from '@ying/shared/entity'

type TPushData = PushData & {
  pushRecordId?: number
}

declare const self: ServiceWorkerGlobalScope

const ApiPrefix = location.origin + import.meta.env.APP_API_BASE

async function request(url: string, method: string, body?: BodyInit) {
  return fetch(`${ApiPrefix}${url}`, {
    method,
    body,
    headers: {
      pragma: 'no-cache',
      'cache-control': 'no-cache'
    }
  })
}

self.addEventListener('install', () => {
  console.log('bg install', ApiPrefix)
})

self.addEventListener('activate', () => {
  console.log('bg activate', ApiPrefix)
})

function parsePushData(pushData: PushMessageData) {
  try {
    const data = pushData.json() as TPushData
    return data
  } catch {
    return pushData.text()
  }
}

self.addEventListener('push', event => {
  console.log('push event:', event)
  if (!event.data) return
  const data = parsePushData(event.data)
  console.log('push data:', data)
  if (typeof data !== 'string') {
    self.registration.showNotification(data.title, {
      body: data.body,
      image: data.image,
      actions: data.actions
        ? data.actions.map(el => {
            return { action: el.title, title: el.title }
          })
        : [],
      data,
      silent: false,
      requireInteraction: true
    })
  } else {
    self.registration.showNotification(data)
  }
})

self.addEventListener('notificationclick', async event => {
  console.log('notificationclick event:', event)
  event.notification.close()
  const data = event.notification.data as TPushData

  if (data.pushRecordId) {
    request(`/notice/${data.pushRecordId}/click`, 'get')
  }

  if (event.action) {
    const findAction = data.actions?.find(el => el.title == event.action)
    if (findAction?.link) {
      self.clients.openWindow(findAction.link)
    }
  } else {
    if (data.link) {
      self.clients.openWindow(data.link)
    }
  }
})
