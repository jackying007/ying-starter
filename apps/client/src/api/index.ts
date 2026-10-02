import { http } from './http-client'

export * from './http-error'

export const authAPI = await import('./business/auth').then(res => res.default(http))
export const userAPI = await import('./business/user').then(res => res.default(http))
export const commonAPI = await import('./business/common').then(res => res.default(http))
export const articleAPI = await import('./business/article').then(res => res.default(http))
