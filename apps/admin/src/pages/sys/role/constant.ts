import { BasicStatus } from '@ying/shared'
import type { CreateRoleDto } from '@ying/shared'

export const defaultRoleValues: Partial<CreateRoleDto> = {
  name: '',
  status: BasicStatus.ENABLE,
  sort: undefined,
  remark: '',
  permissionCodes: []
}
