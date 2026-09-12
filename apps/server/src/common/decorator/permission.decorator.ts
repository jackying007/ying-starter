import { SetMetadata } from '@nestjs/common'
import type { TPermission } from '@ying/shared/permission'

export const PERMISSION_SIGN = 'permission_sign'

export const PermissionDecorator = (permission: TPermission) => SetMetadata(PERMISSION_SIGN, permission)
