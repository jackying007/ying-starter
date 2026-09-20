import {
  Injectable,
  Inject,
  NotAcceptableException,
  UnauthorizedException,
  InternalServerErrorException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import type { ConfigType } from '@nestjs/config'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import ms from 'ms'
import { Redis } from 'ioredis'

import { unique } from '@ying/utils'
import { BasicStatus } from '@ying/shared'
import type { AdminLoginDto, UpdateSysUserSelfPasswordDto, UpdateSysUserSelfUserInfoDto } from '@ying/shared'
import { SysPermissionEntity, SysUserEntity } from '@ying/shared'

import { authConfig } from '@/config'
import { comparePass, generatePass } from '@/common/utils'
import { RedisKey, RedisToken } from '@/common/modules/redis/constant'

type VerifiedData = TAdminPayload & {
  iat?: any
  exp?: any
}

@Injectable()
export class SysAuthService {
  @Inject(RedisToken)
  private readonly redis: Redis

  @Inject()
  private readonly jwtService: JwtService

  @Inject(authConfig.KEY)
  private readonly authConf: ConfigType<typeof authConfig>

  @InjectRepository(SysUserEntity)
  private readonly sysUserRepository: Repository<SysUserEntity>

  @InjectRepository(SysPermissionEntity)
  private readonly sysPermissionRepository: Repository<SysPermissionEntity>

  async sign(user: SysUserEntity) {
    const payload: TAdminPayload = {
      id: user.id
    }
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.authConf.adminAccessTokenSecret,
      expiresIn: this.authConf.adminAccessTokenExpiresIn
    })
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.authConf.adminRefreshTokenSecret,
      expiresIn: this.authConf.adminRefreshTokenExpiresIn
    })
    // 用 redis 再存一份可以随时踢出登录
    await this.redis.set(
      `${RedisKey.AdminAuthAccessToken}:${user.id}:${accessToken}`,
      refreshToken,
      'EX',
      ms(this.authConf.adminAccessTokenExpiresIn) / 1000
    )
    await this.redis.set(
      `${RedisKey.AdminAuthRefreshToken}:${user.id}:${refreshToken}`,
      user.id,
      'EX',
      ms(this.authConf.adminRefreshTokenExpiresIn) / 1000
    )
    return {
      accessToken,
      refreshToken
    }
  }

  async login(loginDto: AdminLoginDto) {
    const user = await this.sysUserRepository.findOne({
      where: [
        {
          account: loginDto.username
        },
        {
          email: loginDto.username
        }
      ]
    })
    if (!user) {
      throw new NotAcceptableException('user is not exists!')
    }
    if (!comparePass(loginDto.password, user.password)) {
      throw new NotAcceptableException('wrong password!')
    }
    return this.sign(user)
  }

  verifyAccessToken(token: string) {
    return this.jwtService.verifyAsync<VerifiedData>(token, {
      secret: this.authConf.adminAccessTokenSecret
    })
  }

  verifyRefreshToken(token: string) {
    return this.jwtService.verifyAsync<VerifiedData>(token, {
      secret: this.authConf.adminRefreshTokenSecret
    })
  }

  async refreshToken(token: string) {
    try {
      const payload = await this.verifyRefreshToken(token)

      const existsToken = await this.redis.get(`${RedisKey.AdminAuthRefreshToken}:${payload.id}:${token}`)
      if (!existsToken) throw new UnauthorizedException()

      delete payload.iat
      delete payload.exp

      const accessToken = await this.jwtService.signAsync(payload, {
        secret: this.authConf.adminAccessTokenSecret,
        expiresIn: this.authConf.adminAccessTokenExpiresIn
      })

      await this.redis.set(
        `${RedisKey.AdminAuthAccessToken}:${payload.id}:${accessToken}`,
        token,
        'EX',
        ms(this.authConf.adminAccessTokenExpiresIn) / 1000
      )
      return accessToken
    } catch {
      throw new UnauthorizedException()
    }
  }

  async logout(token: string, userId: number) {
    const accessTokenKey = `${RedisKey.AdminAuthAccessToken}:${userId}:${token}`
    const refreshToken = await this.redis.get(accessTokenKey)
    await this.redis.del(accessTokenKey)
    await this.redis.del(`${RedisKey.AdminAuthRefreshToken}:${userId}:${refreshToken}`)
  }

  async getUserInfo(uid: number) {
    const sysUserEntity = await this.sysUserRepository.findOne({
      where: {
        id: uid
      },
      relations: ['roles', 'roles.permissions', 'avatar']
    })

    if (!sysUserEntity) throw new UnauthorizedException()

    const roles = sysUserEntity.roles.filter(role => role.status === BasicStatus.ENABLE)

    sysUserEntity.permissions = unique(
      roles.reduce((prev, cur) => [...prev, ...cur.permissions], [] as SysPermissionEntity[])
    )

    const isSuperAdmin = roles.some(el => el.systemic)
    if (isSuperAdmin) {
      sysUserEntity.permissions = await this.sysPermissionRepository.find()
    }

    sysUserEntity.permissions = sysUserEntity.permissions.sort((a, b) => {
      if (!a.sortId || !b.sortId) {
        return 0
      }
      return a.sortId - b.sortId
    })

    return sysUserEntity
  }

  async updateUserInfo(dto: UpdateSysUserSelfUserInfoDto, id: number) {
    return this.sysUserRepository.update({ id }, dto)
  }

  async updateUserPassword(dto: UpdateSysUserSelfPasswordDto, id: number) {
    const user = await this.sysUserRepository.findOne({
      where: { id }
    })
    if (!user) {
      throw new InternalServerErrorException('User does not exist!')
    }
    if (!comparePass(dto.oldPass, user.password)) {
      throw new InternalServerErrorException('The password is incorrect!')
    }

    const sysUser = this.sysUserRepository.create({ id })
    sysUser.password = generatePass(dto.newPass)

    return this.sysUserRepository.save(sysUser)
  }
}
