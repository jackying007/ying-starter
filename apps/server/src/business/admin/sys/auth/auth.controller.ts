import { Body, Controller, Get, Post, Req } from '@nestjs/common'
import type { Request } from 'express'
import { adminLoginDto, type AdminLoginDto } from '@ying/shared'
import { omit } from '@ying/utils'
import { AdminScope, Public, Token, UID } from '@/common/decorator'
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
  logout(@Token() token: string, @UID() uid: number) {
    return this.authService.logout(token, uid)
  }

  @Get('user')
  async getUserInfo(@UID() uid: number) {
    const user = await this.authService.getUserInfo(uid)
    return omit(user, 'password')
  }
}
