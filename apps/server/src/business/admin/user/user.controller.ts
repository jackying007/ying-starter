import { Controller, Get, Query, Res } from '@nestjs/common'
import type { Response } from 'express'
import { listUserDto, type ListUserDto } from '@ying/shared'
import { omitArray } from '@ying/utils'
import { pms } from '@ying/shared/permission'
import { AdminScope, PermissionDecorator } from '@/common/decorator'
import { UserService } from '@/business/modules/user'

@PermissionDecorator(pms.user)
@AdminScope()
@Controller('admin/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('list')
  async list(@Query({ schema: listUserDto }) dto: ListUserDto) {
    const users = await this.userService.list(dto)
    return omitArray(users, 'password')
  }

  @Get('list-count')
  listCount(@Query({ schema: listUserDto }) dto: ListUserDto) {
    return this.userService.listCount(dto)
  }

  @PermissionDecorator(pms.user.export)
  @Get('export')
  async exportBlindBoxInfo(@Query({ schema: listUserDto }) dto: ListUserDto, @Res() res: Response) {
    const exportRes = await this.userService.export(dto)
    if (!exportRes) {
      res.send(500)
      return
    }
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(exportRes.fileName)}.xlsx"`)
    res.send(exportRes.excelBuffer)
  }
}
