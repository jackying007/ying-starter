import { Reflector } from '@nestjs/core'
import type { CanActivate, ExecutionContext } from '@nestjs/common'
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import type { Request } from 'express'
import { getTokenFromRequest } from '@/common/utils'
import { IS_PUBLIC_KEY, CLIENT_SCOPE } from '@/common/decorator'
import { AuthService } from './auth.service'

@Injectable()
export class ClientAuthGuard implements CanActivate {
  @Inject()
  private reflector: Reflector
  @Inject()
  private readonly authService: AuthService

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>()

    const accesstoken = getTokenFromRequest(request)

    const handler = context.getHandler()
    const classContext = context.getClass()

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [handler, classContext])
    if (isPublic) {
      return true
    }

    const isClienScope = this.reflector.getAllAndOverride<boolean>(CLIENT_SCOPE, [handler, classContext])
    if (!isClienScope) {
      return true
    }

    if (!accesstoken) throw new UnauthorizedException()

    try {
      const payload = await this.authService.verifyAccessToken(accesstoken)
      request.user = payload
      return true
    } catch {
      throw new UnauthorizedException()
    }
  }
}
