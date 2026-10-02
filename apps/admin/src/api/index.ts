import { http } from './http-client'

export * from './http-error'
export * from './helpers'

export const sysAuthApi = await import('./business/sys.auth').then(res => res.default(http))
export const sysRoleApi = await import('./business/sys.role').then(res => res.default(http))
export const sysUserApi = await import('./business/sys.user').then(res => res.default(http))
export const sysSettingApi = await import('./business/sys.setting').then(res => res.default(http))
export const commonApi = await import('./business/common').then(res => res.default(http))
export const userApi = await import('./business/user').then(res => res.default(http))
export const articleApi = await import('./business/article').then(res => res.default(http))
export const notificationApi = await import('./business/notification').then(res => res.default(http))
