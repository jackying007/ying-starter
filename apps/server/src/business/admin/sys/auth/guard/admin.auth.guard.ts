import type { CanActivate, ExecutionContext } from '@nestjs/common'
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import type { Request } from 'express'

import { RedisKey, type RedisObjs, RedisToken } from '@/common/modules/redis'
import { getTokenFromRequest } from '@/common/utils'
import { IS_PUBLIC_KEY, ADMIN_SCOPE } from '@/common/decorator'

import { SysAuthService } from '../auth.service'

@Injectable()
export class AdminAuthGuard implements CanActivate {
  @Inject()
  private reflector: Reflector
  @Inject()
  private readonly authService: SysAuthService
  @Inject(RedisToken)
  private readonly redisObjs: RedisObjs

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>()

    const accesstoken = getTokenFromRequest(request)
    request.token = accesstoken

    const handler = context.getHandler()
    const classContext = context.getClass()

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [handler, classContext])
    if (isPublic) {
      return true
    }

    const isAdminScope = this.reflector.getAllAndOverride<boolean>(ADMIN_SCOPE, [handler, classContext])
    if (!isAdminScope) {
      return true
    }

    if (!accesstoken) throw new UnauthorizedException()

    try {
      const payload = await this.authService.verifyAccessToken(accesstoken)
      const refreshToken = await this.redisObjs.redis.get(
        `${RedisKey.AdminAuthAccessToken}:${payload.id}:${accesstoken}`
      )
      if (!refreshToken) throw new UnauthorizedException()
      request.user = payload
      return true
    } catch {
      throw new UnauthorizedException()
    }
  }
}
