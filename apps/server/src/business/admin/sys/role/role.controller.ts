import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { createOrUpdateRoleDto, listRoleDto } from '@ying/shared'
import type { CreateOrUpdateRoleDto, ListRoleDto } from '@ying/shared'
import { pms } from '@ying/shared/permission'
import { AdminScope, PermissionDecorator } from '@/common/decorator'
import { SysRoleService } from './role.service'

@PermissionDecorator(pms.sys.role)
@AdminScope()
@Controller('admin/sys-role')
export class SysRoleController {
  constructor(private readonly sysRoleService: SysRoleService) {}

  @Get('list')
  list(@Query({ schema: listRoleDto }) dto: ListRoleDto) {
    return this.sysRoleService.list(dto)
  }

  @Get('list-count')
  listCount(@Query({ schema: listRoleDto }) dto: ListRoleDto) {
    return this.sysRoleService.listCount(dto)
  }

  @Get('permissions')
  listPermissions() {
    return this.sysRoleService.listPermissions()
  }

  @PermissionDecorator(pms.sys.role.create)
  @Post()
  create(@Body({ schema: createOrUpdateRoleDto }) dto: CreateOrUpdateRoleDto) {
    return this.sysRoleService.create(dto)
  }

  @PermissionDecorator(pms.sys.role.update)
  @Put()
  update(@Body({ schema: createOrUpdateRoleDto }) dto: CreateOrUpdateRoleDto) {
    return this.sysRoleService.update(dto)
  }

  @PermissionDecorator(pms.sys.role.delete)
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.sysRoleService.delete([id])
  }
}
