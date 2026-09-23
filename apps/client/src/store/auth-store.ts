import { create } from 'zustand'
import type { UserInfoVo } from '@ying/server/types-client'
import { authAPI, userAPI } from '@/api'
import { CookieEnum } from '@/enum'
import { getCookie, setCookie, removeCookie } from '@/cookie'
import { useMemo } from 'react'

type AuthStore = {
  userInfo?: UserInfoVo
  accessToken?: string
  refreshToken?: string
}

export const useAuthStore = create<AuthStore>(() => ({
  userInfo: undefined,
  accessToken: getCookie(CookieEnum.AccessToken),
  refreshToken: getCookie(CookieEnum.RefreshToken)
}))

export const useHasAuth = () => {
  const accessToken = useAuthStore(state => state.accessToken)
  return !!accessToken
}

export const useUserAvatar = () => {
  const userInfo = useAuthStore(state => state.userInfo)
  const avatar = useMemo(() => {
    const customAvatar = userInfo?.avatar?.url
    if (customAvatar) return customAvatar
    const oauthAvatar = userInfo?.oauthAccounts?.[0]?.avatar
    if (oauthAvatar) return oauthAvatar
  }, [userInfo])
  return avatar
}

export const hasAuth = () => {
  return !!getCookie(CookieEnum.AccessToken)
}

export function setUserInfo(userInfo: UserInfoVo) {
  useAuthStore.setState({ userInfo })
}

export function setRefreshToken(refreshToken: string) {
  setCookie(CookieEnum.RefreshToken, refreshToken)
  useAuthStore.setState({ refreshToken })
}

export function setAccessToken(accessToken: string) {
  setCookie(CookieEnum.AccessToken, accessToken)
  useAuthStore.setState({ accessToken })
}

export const clearUserInfoAndAuthTokens = () => {
  removeCookie(CookieEnum.AccessToken)
  removeCookie(CookieEnum.RefreshToken)
  useAuthStore.setState({ userInfo: undefined, accessToken: undefined, refreshToken: undefined })
}

export const updateAccessToken = (accessToken: string) => {
  setCookie(CookieEnum.AccessToken, accessToken)
  useAuthStore.setState({ accessToken })
}

export const updateUserInfo = async () => {
  const userInfo = await userAPI.getInfo()
  setUserInfo(userInfo)
}

export const logout = async () => {
  await authAPI.logout()
  clearUserInfoAndAuthTokens()
}
