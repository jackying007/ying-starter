import { BasicStatus } from '@ying/shared'
import type { CreateOrUpdateRoleDto } from '@ying/shared'

export const defaultRoleValues: Partial<CreateOrUpdateRoleDto> = {
  name: '',
  status: BasicStatus.ENABLE,
  sort: undefined,
  remark: '',
  permissionCodes: []
}
