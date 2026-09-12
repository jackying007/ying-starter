import { create } from 'zustand'
import type { ClientUserVo, ClientAuthVo } from '@ying/shared'
import { authAPI, userAPI } from '@/api'
import { CookieEnum } from '@/enum'
import { getCookie, setCookie, removeCookie } from '@/cookie'
import { useMemo } from 'react'

type AuthStore = {
  userInfo?: ClientUserVo
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

export function setUserInfo(userInfo: ClientUserVo) {
  useAuthStore.setState({ userInfo })
}

export function setAuthTokens(authTokens: ClientAuthVo) {
  setCookie(CookieEnum.AccessToken, authTokens.accessToken)
  setCookie(CookieEnum.RefreshToken, authTokens.refreshToken)
  useAuthStore.setState({ ...authTokens })
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
