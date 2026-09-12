import { Body, Controller, Get, Put, Request, UnauthorizedException } from '@nestjs/common'
import type { Request as TRequest } from 'express'

import { UpdateUserInfoDto, ResetPasswordDto } from '@ying/shared/dto'
import type { ClientUserVo } from '@ying/shared/vo'
import { omit } from '@ying/utils'

import { ClientScope } from '@/common/decorator'
import { UserService } from '@/business/modules/user'

@ClientScope()
@Controller('client/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('info')
  async getInfo(@Request() req: TRequest): Promise<ClientUserVo> {
    const user = await this.userService.findById(req.user!.id)
    if (!user) throw new UnauthorizedException()
    return {
      ...omit(user, 'password'),
      hasPassword: Boolean(user.password)
    }
  }

  @Put()
  updateInfo(@Body() dto: UpdateUserInfoDto, @Request() req: TRequest) {
    return this.userService.updateInfo(dto, req.user!.id)
  }

  @Put('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto, @Request() req: TRequest) {
    return this.userService.resetPassword(dto, req.user!.id)
  }
}
