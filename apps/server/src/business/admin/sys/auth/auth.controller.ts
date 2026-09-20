import { Body, Controller, Get, Post, Put, Req, UnauthorizedException } from '@nestjs/common'
import type { Request } from 'express'
import {
  adminLoginDto,
  updateSysUserSelfPasswordDto,
  updateSysUserSelfUserInfoDto,
  type AdminLoginDto,
  type UpdateSysUserSelfPasswordDto,
  type UpdateSysUserSelfUserInfoDto
} from '@ying/shared'
import { omit } from '@ying/utils'
import { AdminScope, Public, UID } from '@/common/decorator'
import { getRefreshTokenFromRequest } from '@/common/utils'
import { SysAuthService } from './auth.service'

@Controller('admin/sys/auth')
@AdminScope()
export class SysAuthController {
  constructor(private readonly authService: SysAuthService) {}

  @Post('login')
  @Public()
  login(@Body({ schema: adminLoginDto }) dto: AdminLoginDto) {
    return this.authService.login(dto)
  }

  @Get('refresh')
  @Public()
  refresh(@Req() req: Request) {
    return this.authService.refreshToken(getRefreshTokenFromRequest(req) ?? '')
  }

  @Get('logout')
  logout(@Req() req: Request) {
    const userId = req.user?.id
    const refreshToken = getRefreshTokenFromRequest(req)
    if (!userId || !refreshToken) throw new UnauthorizedException()
    return this.authService.logout(userId, refreshToken)
  }

  @Get('user-info')
  async getUserInfo(@UID() uid: number) {
    const user = await this.authService.getUserInfo(uid)
    return omit(user, 'password')
  }

  @Put('user-info')
  updateUserInfo(
    @Body({ schema: updateSysUserSelfUserInfoDto }) dto: UpdateSysUserSelfUserInfoDto,
    @UID() uid: number
  ) {
    return this.authService.updateUserInfo(dto, uid)
  }

  @Put('user-password')
  updateUserPassword(
    @Body({ schema: updateSysUserSelfPasswordDto }) dto: UpdateSysUserSelfPasswordDto,
    @UID() uid: number
  ) {
    return this.authService.updateUserPassword(dto, uid)
  }
}
