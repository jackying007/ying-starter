import { z } from 'zod'
import { BasicStatus, listDto } from '../base'

export const listRoleDto = listDto.extend({
  name: z.string().optional(),
  status: z.coerce.number().pipe(z.enum(BasicStatus)).optional()
})

export type ListRoleDto = z.infer<typeof listRoleDto>

export const createOrUpdateRoleDto = z.object({
  id: z.number().optional(),
  name: z.string().nonempty('角色名称不能为空').max(32),
  status: z.enum(BasicStatus),
  permissionCodes: z.array(z.string()),
  remark: z.string().max(200).nullable()
})

export type CreateOrUpdateRoleDto = z.infer<typeof createOrUpdateRoleDto>
