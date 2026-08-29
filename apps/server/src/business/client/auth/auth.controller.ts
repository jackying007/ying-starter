import { Controller, Post, Get, Res, Inject, Body, UseFilters, Query, Req } from '@nestjs/common'
import type { Request, Response } from 'express'
import type { ConfigType } from '@nestjs/config'
import { I18nContext } from 'nestjs-i18n'

import {
  ClientLoginDto,
  ClientRegisterDto,
  VerifyEmailDto,
  ForgotPasswordDto,
  ResetPasswordWithCodeDto
} from '@ying/dto'

import { ClientScope, UID, Token } from '@/common/decorator'
import { authConfig } from '@/config'
import { AuthService } from './auth.service'
import { OAuthService } from './oauth.service'
import { OAuthLoginExceptionFilter } from './oauth.login.filter'
import { getRefreshTokenFromRequest } from '@/common/utils'

@Controller('client/auth')
export class AuthController {
  @Inject(authConfig.KEY)
  private readonly authConf: ConfigType<typeof authConfig>
  @Inject()
  private readonly authService: AuthService
  @Inject()
  private readonly oauthService: OAuthService

  @Post('login')
  login(@Body() dto: ClientLoginDto) {
    return this.authService.login(dto)
  }

  @Get('refresh')
  refresh(@Req() req: Request) {
    return this.authService.refreshToken(getRefreshTokenFromRequest(req) ?? '')
  }

  @Post('register')
  async register(@Body() dto: ClientRegisterDto) {
    return this.authService.register(dto)
  }

  @Post('verify-email')
  async verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.authService.verifyEmail(dto)
  }

  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto)
  }

  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordWithCodeDto) {
    return this.authService.resetPassword(dto)
  }

  @Get('logout')
  @ClientScope()
  async logout(@Token() token: string, @UID() uid: number) {
    return this.authService.logout(token, uid)
  }

  @Get('google')
  @UseFilters(OAuthLoginExceptionFilter)
  async googleLogin(@Res() res: Response) {
    return res.redirect(await this.oauthService.getGoogleLoginUrl())
  }

  @Get('google/callback')
  @UseFilters(OAuthLoginExceptionFilter)
  async googleLoginCallback(@Query('code') code: string, @Query('state') state: string, @Res() res: Response) {
    const googleUserInfo = await this.oauthService.validateGoogleCallback(code, state)
    const user = await this.oauthService.getOrCreateOAuthAccountAndUser(googleUserInfo, 'google')
    const { accessToken, refreshToken } = await this.authService.sign(user)
    const i18n = I18nContext.current()
    res.redirect(
      `${this.authConf.authClientUrl}/${i18n?.lang ?? 'en'}/auth/login?accessToken=${accessToken}&refreshToken=${refreshToken}`
    )
  }

  @Get('github')
  @UseFilters(OAuthLoginExceptionFilter)
  githubLogin(@Res() res: Response) {
    return res.redirect(this.oauthService.getGitHubLoginUrl())
  }

  @Get('github/callback')
  @UseFilters(OAuthLoginExceptionFilter)
  async githubCallback(@Query('code') code: string, @Res() res: Response) {
    const githubUserInfo = await this.oauthService.validateGitHubCallback(code)
    const user = await this.oauthService.getOrCreateOAuthAccountAndUser(githubUserInfo, 'github')
    const { accessToken, refreshToken } = await this.authService.sign(user)
    const i18n = I18nContext.current()
    res.redirect(
      `${this.authConf.authClientUrl}/${i18n?.lang ?? 'en'}/auth/login?accessToken=${accessToken}&refreshToken=${refreshToken}`
    )
  }
}
