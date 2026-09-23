import type { hc } from 'hono/client'
import type { admin } from './business/admin'
export type HcJsonRes<T extends (...args: any[]) => any> = Awaited<ReturnType<Awaited<ReturnType<T>>['json']>>
export type HCAdmin = ReturnType<typeof hc<typeof admin>>

export type SysAuthLoginVo = HcJsonRes<HCAdmin['sys-auth']['login']['$post']>
export type SysAuthUserInfoVo = HcJsonRes<HCAdmin['sys-auth']['user-info']['$get']>
export type SysRoleListVo = HcJsonRes<HCAdmin['sys-role']['list']['$get']>
export type SysPermissionsVo = HcJsonRes<HCAdmin['sys-role']['permissions']['$get']>
export type SysUserListVo = HcJsonRes<HCAdmin['sys-user']['list']['$get']>

export type UserListVo = HcJsonRes<HCAdmin['user']['list']['$get']>
export type UserStatVo = HcJsonRes<HCAdmin['user-stat']['growth-trend-all']['$get']>
export type UserStatByTypeVo = HcJsonRes<HCAdmin['user-stat']['growth-trend']['$get']>

export type FileListVo = HcJsonRes<HCAdmin['file']['list']['$get']>
export type FileVo = HcJsonRes<HCAdmin['file']['image']['$post']>
export type FeedbackListVo = HcJsonRes<HCAdmin['feedback']['list']['$get']>

export type ArticleListVo = HcJsonRes<HCAdmin['article']['list']['$get']>
export type ArticleVo = HcJsonRes<HCAdmin['article'][':id']['$get']>

export type VisitorListVo = HcJsonRes<HCAdmin['visitor']['list']['$get']>
export type PushTemplateListVo = HcJsonRes<HCAdmin['push-template']['list']['$get']>
export type SendPushTemplateVo = HcJsonRes<HCAdmin['push-template']['send']['$post']>
export type PushTaskListVo = HcJsonRes<HCAdmin['push-task']['list']['$get']>
export type PushRecordListVo = HcJsonRes<HCAdmin['push-record']['list']['$get']>
