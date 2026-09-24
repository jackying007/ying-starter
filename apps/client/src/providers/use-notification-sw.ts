import { useEffect, useRef, useState } from 'react'
import type { PushSubscription } from 'web-push'
import { storage } from '@ying/shared-web'
import { commonAPI } from '@/api'
import { StorageEnum } from '@/enum'

const vapidPublicKey = import.meta.env.APP_VAPID_PUBLIC_KEY

const registerSw = async (onReady: (registration: ServiceWorkerRegistration) => void) => {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.register('/notification-sw.js', { scope: '/notification' })
    await registration.update() // Attempt to update, this operation does not use the cache by default.

    let serviceWorker: ServiceWorker | undefined
    if (registration.installing) {
      serviceWorker = registration.installing
    } else if (registration.waiting) {
      serviceWorker = registration.waiting
    } else if (registration.active) {
      serviceWorker = registration.active
    }

    // console.log('Current service worker: ', serviceWorker)
    if (!serviceWorker) return
    if (serviceWorker.state === 'activated') {
      onReady(registration)
    } else {
      serviceWorker.addEventListener('statechange', () => {
        // console.log('Service worker statechange: ', serviceWorker.state)
        if (serviceWorker.state === 'activated') {
          onReady(registration)
        }
      })
    }
  } else {
    console.error('Service worker are not supported.')
  }
}

const startSubscribe = async (registration: ServiceWorkerRegistration, visitorId: string) => {
  if (!vapidPublicKey) return
  // console.log('startSubscribe...')
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: vapidPublicKey
  })
  const pushSubscription = subscription.toJSON() as PushSubscription
  // console.log('PushSubscription:', pushSubscription)
  await commonAPI.subscribe({
    visitorId,
    pushSubscription
  })
  // console.log('subscribe end.')
}

const checkNotificationPermission = async () => {
  // console.log('checkNotificationPermission...')
  const permission = await Notification.requestPermission()
  // console.log('NotificationPermission:', permission)
  if (permission !== 'granted') {
    // console.log('The user refused to receive notifications.')
    return false
  }
  return true
}

const checkSubscribeState = async (registration: ServiceWorkerRegistration) => {
  try {
    if (!vapidPublicKey) return 'no-pubkey'
    const existingSubscription = await registration.pushManager.getSubscription()
    if (!existingSubscription) return 'no-sub'
    const existingApplicationServerKey = existingSubscription.options.applicationServerKey
    if (!existingApplicationServerKey) return 'no-sub'
    const currentKey = btoa(
      String.fromCharCode.apply(null, new Uint8Array(existingApplicationServerKey) as unknown as number[])
    )
      .replaceAll('+', '-')
      .replaceAll('/', '_')
      .replaceAll('=', '')
    if (currentKey === vapidPublicKey) return 'has-sub'
    console.log('new vapid publicKey update.')
    await existingSubscription.unsubscribe()
    return 'no-sub'
  } catch (error) {
    console.error('checkCanSubscribe error:', error)
    return 'error'
  }
}

export const useNotificationSw = () => {
  const [subscribeState, setSubscribeState] = useState<Awaited<ReturnType<typeof checkSubscribeState>>>('no-pubkey')
  const registrationRef = useRef<ServiceWorkerRegistration>(null)
  useEffect(() => {
    registerSw(async registration => {
      registrationRef.current = registration
      // console.log('checkSubscribeState...')
      const state = await checkSubscribeState(registration)
      setSubscribeState(state)
      // console.log('subscribeState', state)
    })
  }, [])

  const subscribe = async () => {
    const visitorId = storage.getStringItem(StorageEnum.VisitorId)
    if (!registrationRef.current || !visitorId || subscribeState !== 'no-sub') return
    const hasPermission = await checkNotificationPermission()
    if (!hasPermission) return
    await startSubscribe(registrationRef.current, visitorId)
    const state = await checkSubscribeState(registrationRef.current)
    setSubscribeState(state)
  }

  return {
    subscribeState,
    subscribe
  }
}
