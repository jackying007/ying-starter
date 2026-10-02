import type { SysAuthController } from './business/admin/sys/auth/auth.controller'
import type { SysRoleController } from './business/admin/sys/role/role.controller'
import type { SysUserController } from './business/admin/sys/user/user.controller'
import type { UserController } from './business/admin/user/user.controller'
import type { UserStatController } from './business/admin/user/user.stat.controller'
import type { FileController } from './business/admin/common/file.controller'
import type { FeedbackController } from './business/admin/common/feedback.controller'
import type { ArticleController } from './business/admin/article/article.controller'
import type { NotificationController } from './business/admin/notification/notification.controller'

export type SysAuthLoginVo = Awaited<ReturnType<SysAuthController['login']>>
export type SysAuthUserInfoVo = Awaited<ReturnType<SysAuthController['getUserInfo']>>
export type SysRoleListVo = Awaited<ReturnType<SysRoleController['list']>>
export type SysPermissionsVo = Awaited<ReturnType<SysRoleController['listPermissions']>>
export type SysUserListVo = Awaited<ReturnType<SysUserController['list']>>

export type UserListVo = Awaited<ReturnType<UserController['list']>>
export type UserStatVo = Awaited<ReturnType<UserStatController['getUserGrowthTrendAll']>>
export type UserStatByTypeVo = Awaited<ReturnType<UserStatController['getUserGrowthTrend']>>

export type FileListVo = Awaited<ReturnType<FileController['listFile']>>
export type FileVo = Awaited<ReturnType<FileController['uploadImage']>>
export type FeedbackListVo = Awaited<ReturnType<FeedbackController['listFeedback']>>

export type ArticleListVo = Awaited<ReturnType<ArticleController['list']>>
export type ArticleVo = Awaited<ReturnType<ArticleController['detail']>>

export type VisitorListVo = Awaited<ReturnType<NotificationController['listVisitor']>>
export type PushTemplateListVo = Awaited<ReturnType<NotificationController['listPushTemplate']>>
export type SendPushTemplateVo = Awaited<ReturnType<NotificationController['send']>>
export type PushTaskListVo = Awaited<ReturnType<NotificationController['listPushTask']>>
export type PushRecordListVo = Awaited<ReturnType<NotificationController['listPushRecord']>>
