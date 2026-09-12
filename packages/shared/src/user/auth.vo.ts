import type { UserEntity } from './user.entity'
import { BaseVo } from '../base'

export type ClientUserVo = Omit<UserEntity, 'password'> & {
  hasPassword: boolean
}

export type ClientAuthVo = {
  accessToken: string
  refreshToken: string
}

export type ClientLoginVo = BaseVo<0, ClientAuthVo> | BaseVo<'emailNotVerified', undefined>
