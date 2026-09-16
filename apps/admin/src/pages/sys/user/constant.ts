import { BasicStatus } from '@ying/shared'
import type { CreateOrUpdateSysUserDto } from '@ying/shared'

export const defaultUserValues: CreateOrUpdateSysUserDto = {
  name: '',
  account: '',
  email: undefined,
  password: undefined,
  status: BasicStatus.ENABLE,
  roleIds: [],
  remark: undefined
}
