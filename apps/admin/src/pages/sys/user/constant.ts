import { BasicStatus } from '@ying/shared'
import type { UpdateSysUserDto } from '@ying/shared'

export const defaultUserValues: Partial<UpdateSysUserDto> = {
  id: undefined,
  name: '',
  account: '',
  email: '',
  password: '',
  status: BasicStatus.ENABLE,
  roleIds: [],
  remark: undefined
}
