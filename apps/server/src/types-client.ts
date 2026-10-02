import type { AuthController } from './business/client/auth/auth.controller'
import type { UserController } from './business/client/common/user.controller'
import type { CommonController } from './business/client/common/common.controller'
import type { ArticleController } from './business/client/article/article.controller'

export type AuthLoginVo = Awaited<ReturnType<AuthController['login']>>
export type UserInfoVo = Awaited<ReturnType<UserController['getInfo']>>

export type FileVo = Awaited<ReturnType<CommonController['uploadImage']>>

export type ArticleListVo = Awaited<ReturnType<ArticleController['list']>>
export type ArticleVo = Awaited<ReturnType<ArticleController['detail']>>
