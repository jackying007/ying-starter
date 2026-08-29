import { SetMetadata } from '@nestjs/common'
import type { TPermission } from '@ying/permission'

export const PERMISSION_SIGN = 'permission_sign'

export const PermissionDecorator = (permission: TPermission) => SetMetadata(PERMISSION_SIGN, permission)
