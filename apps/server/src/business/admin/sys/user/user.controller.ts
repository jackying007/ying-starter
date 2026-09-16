import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'

import {
  listSysUserDto,
  createOrUpdateSysUserDto,
  updateSysUserPasswordDto,
  updateSysUserSelfPasswordDto,
  updateSysUserSelfUserInfoDto
} from '@ying/shared'
import type {
  ListSysUserDto,
  CreateOrUpdateSysUserDto,
  UpdateSysUserPasswordDto,
  UpdateSysUserSelfPasswordDto,
  UpdateSysUserSelfUserInfoDto
} from '@ying/shared'
import { omitArray } from '@ying/utils'
import { pms } from '@ying/shared/permission'

import { AdminScope, PermissionDecorator, UID } from '@/common/decorator'
import { SysUserService } from './user.service'

@PermissionDecorator(pms.sys.user)
@AdminScope()
@Controller('admin/sys/user')
export class SysUserController {
  constructor(private readonly sysUserService: SysUserService) {}

  @Get('list')
  async list(@Query({ schema: listSysUserDto }) dto: ListSysUserDto) {
    const users = await this.sysUserService.list(dto)
    return omitArray(users, 'password')
  }

  @Get('list-count')
  listCount(@Query({ schema: listSysUserDto }) dto: ListSysUserDto) {
    return this.sysUserService.listCount(dto)
  }

  @PermissionDecorator(pms.sys.user.create)
  @Post()
  create(@Body({ schema: createOrUpdateSysUserDto }) dto: CreateOrUpdateSysUserDto) {
    return this.sysUserService.createOrUpdate(dto)
  }

  @PermissionDecorator(pms.sys.user.update)
  @Put()
  update(@Body({ schema: createOrUpdateSysUserDto }) dto: CreateOrUpdateSysUserDto) {
    return this.sysUserService.createOrUpdate(dto)
  }

  @PermissionDecorator(pms.sys.user.delete)
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.sysUserService.delete([id])
  }

  @PermissionDecorator(pms.sys.user.update)
  @Put('password')
  updatePassword(@Body({ schema: updateSysUserPasswordDto }) dto: UpdateSysUserPasswordDto) {
    return this.sysUserService.updatePassword(dto)
  }

  @Put('self-info')
  updateSelfInfo(
    @Body({ schema: updateSysUserSelfUserInfoDto }) dto: UpdateSysUserSelfUserInfoDto,
    @UID() uid: number
  ) {
    return this.sysUserService.updateSelfInfo(dto, uid)
  }

  @Put('self-password')
  updateSelfPassword(
    @Body({ schema: updateSysUserSelfPasswordDto }) dto: UpdateSysUserSelfPasswordDto,
    @UID() uid: number
  ) {
    return this.sysUserService.updateSelfPassword(dto, uid)
  }
}
