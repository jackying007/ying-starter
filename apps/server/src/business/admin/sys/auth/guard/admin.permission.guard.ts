import type { CanActivate, ExecutionContext } from '@nestjs/common'
import { Inject, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import type { Request } from 'express'
import type { TPermission } from '@ying/shared/permission'
import { PERMISSION_SIGN } from '@/common/decorator'
import { RedisKey, type RedisObjs, RedisToken } from '@/common/modules/redis/constant'
import { SysAuthService } from '../auth.service'

@Injectable()
export class AdminPermissionGuard implements CanActivate {
  @Inject()
  private readonly reflector: Reflector
  @Inject()
  private readonly authService: SysAuthService
  @Inject(RedisToken)
  private readonly redisObjs: RedisObjs

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const handler = context.getHandler()
    const classContext = context.getClass()

    const handlerPermission = this.reflector.get<TPermission | undefined>(PERMISSION_SIGN, handler)
    const classPermission = this.reflector.get<TPermission | undefined>(PERMISSION_SIGN, classContext)
    const permissions: TPermission[] = []
    if (handlerPermission) permissions.push(handlerPermission)
    if (classPermission) permissions.push(classPermission)
    if (!permissions.length) return true

    const permissionCodes = permissions.map(el => el.code).filter(code => typeof code === 'string')

    const request = context.switchToHttp().getRequest<Request>()
    const userId = request.user?.id
    const KEY = `${RedisKey.AdminAuthPermission}:${userId}`
    const userPermissionCodesStr = await this.redisObjs.redis.get(KEY)
    let userPermissionCodes: string[] = []

    if (!userPermissionCodesStr) {
      if (userId) {
        const userInfo = await this.authService.getUserInfo(userId)
        if (userInfo.permissions) {
          userPermissionCodes = userInfo.permissions.map(el => el.code)
          await this.redisObjs.redis.set(KEY, JSON.stringify(userPermissionCodes))
        }
      }
    } else {
      userPermissionCodes = JSON.parse(userPermissionCodesStr) as string[]
    }

    if (!permissionCodes.every(el => userPermissionCodes.includes(el))) return false

    return true
  }
}
