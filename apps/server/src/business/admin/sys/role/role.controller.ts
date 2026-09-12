import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { CreateRoleDto, ListRoleDto, UpdateRoleDto } from '@ying/shared'
import { pms } from '@ying/shared/permission'
import { AdminScope, PermissionDecorator } from '@/common/decorator'
import { SysRoleService } from './role.service'

@PermissionDecorator(pms.sys.role)
@AdminScope()
@Controller('admin/sys/role')
export class SysRoleController {
  constructor(private readonly sysRoleService: SysRoleService) {}

  @Get('list')
  list(@Query() listRoleDto: ListRoleDto) {
    return this.sysRoleService.list(listRoleDto)
  }

  @Get('list-count')
  listCount(@Query() listRoleDto: ListRoleDto) {
    return this.sysRoleService.listCount(listRoleDto)
  }

  @Get('permissions')
  listPermissions() {
    return this.sysRoleService.listPermissions()
  }

  @PermissionDecorator(pms.sys.role.create)
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.sysRoleService.create(createRoleDto)
  }

  @PermissionDecorator(pms.sys.role.update)
  @Put()
  update(@Body() updateRoleDto: UpdateRoleDto) {
    return this.sysRoleService.update(updateRoleDto)
  }

  @PermissionDecorator(pms.sys.role.delete)
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.sysRoleService.delete([id])
  }
}
