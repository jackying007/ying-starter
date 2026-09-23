import { useCallback } from 'react'
import { create } from 'zustand'
import cookie from 'js-cookie'

import type { TPermission } from '@ying/shared/permission'
import { storage } from '@ying/frontend/utils'
import type { SysAuthUserInfoVo } from '@ying/server/types-admin'

import { sysAuthApi } from '@/api'
import { CookieEnum, StorageEnum } from '@/types/enum'

type UserStore = {
  accessToken?: string
  refreshToken?: string
  userInfo?: SysAuthUserInfoVo
}

export const useUserStore = create<UserStore>()(() => {
  const userInfo = storage.getItem<SysAuthUserInfoVo>(StorageEnum.UserInfo)

  return {
    accessToken: cookie.get(CookieEnum.AccessToken),
    refreshToken: cookie.get(CookieEnum.RefreshToken),
    userInfo
  }
})

export const useAccessToken = () => useUserStore(state => state.accessToken)
export const useUserInfo = () => useUserStore(state => state.userInfo)
export const useUserPermission = () => useUserStore(state => state.userInfo?.permissions)

export const useHasPermission = () => {
  const permissions = useUserPermission()
  const hasPermission = useCallback(
    (pm: TPermission) => {
      if (!permissions || !pm.code) return false
      return permissions.map(el => el.code).includes(pm.code)
    },
    [permissions]
  )
  return hasPermission
}

export const setAccessToken = (accessToken: string) => {
  useUserStore.setState({ accessToken })
  cookie.set(CookieEnum.AccessToken, accessToken, { expires: 365 })
}

export const setRefreshToken = (refreshToken: string) => {
  useUserStore.setState({ refreshToken })
  cookie.set(CookieEnum.RefreshToken, refreshToken, { expires: 365 })
}

export const setUserInfo = (userInfo: SysAuthUserInfoVo) => {
  useUserStore.setState({ userInfo })
  storage.setItem(StorageEnum.UserInfo, userInfo)
}

export const clearUserStore = () => {
  useUserStore.setState({ userInfo: undefined, accessToken: undefined, refreshToken: undefined })
  storage.removeItem(StorageEnum.UserInfo)
  cookie.remove(CookieEnum.AccessToken)
  cookie.remove(CookieEnum.RefreshToken)
}

export const updateUserInfo = async () => {
  const userInfo = await sysAuthApi.getUserInfo()
  setUserInfo(userInfo)
}

export const logout = async () => {
  await sysAuthApi.logout()
  clearUserStore()
}
