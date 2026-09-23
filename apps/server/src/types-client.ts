import type { hc } from 'hono/client'
import type { client } from './business/client'
export type HcJsonRes<T extends (...args: any[]) => any> = Awaited<ReturnType<Awaited<ReturnType<T>>['json']>>
export type HCClient = ReturnType<typeof hc<typeof client>>

export type AuthLoginVo = HcJsonRes<HCClient['auth']['login']['$post']>
export type UserInfoVo = HcJsonRes<HCClient['user']['info']['$get']>

export type FileVo = HcJsonRes<HCClient['file']['image']['$post']>

export type ArticleListVo = HcJsonRes<HCClient['article']['list']['$get']>
export type ArticleVo = HcJsonRes<HCClient['article'][':id']['$get']>
