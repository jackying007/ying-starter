import { useEffect } from 'react'
import { load } from '@fingerprintjs/fingerprintjs'
import UAParser from 'ua-parser-js'

import type { UserInfoVo } from '@ying/server/types-client'
import { storage } from '@ying/shared-web'

import { StorageEnum } from '@/enum'
import { commonAPI } from '@/api'
import { useAuthStore } from '@/store/auth-store'

const DeviceTypes = ['windows', 'android', 'ios', 'mac os']

async function initVisitor() {
  const fp = await load()
  const visitorId = (await fp.get()).visitorId
  storage.setStringItem(StorageEnum.VisitorId, visitorId)
  const parser = new UAParser()
  const deviceType = parser.getOS().name?.toLowerCase() || 'others'
  await commonAPI.createVisitor({
    visitorId,
    languages: Array.from(navigator.languages),
    userAgent: navigator.userAgent,
    deviceType: DeviceTypes.includes(deviceType) ? deviceType : 'others'
  })
  return visitorId
}

async function bindUser(visitorId: string) {
  await commonAPI.bindUser(visitorId)
}

function isUserNewDevice(user: UserInfoVo, visitorId: string) {
  return !user.visitors?.some(el => el.visitorId === visitorId)
}

export const useVisitor = () => {
  const userInfo = useAuthStore(state => state.userInfo)

  useEffect(() => {
    ;(async () => {
      let visitorId = storage.getStringItem(StorageEnum.VisitorId)
      if (!visitorId) {
        visitorId = await initVisitor()
      }
      if (userInfo && isUserNewDevice(userInfo, visitorId)) {
        bindUser(visitorId)
      }
    })()
  }, [userInfo])
}
