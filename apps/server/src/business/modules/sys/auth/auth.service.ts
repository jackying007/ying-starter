import { Repository } from 'typeorm'
import { HTTPException } from 'hono/http-exception'
import { sign, verify } from 'hono/jwt'
import { unique } from '@ying/utils'
import { BasicStatus } from '@ying/shared'
import type { AdminLoginDto, UpdateSysUserSelfPasswordDto, UpdateSysUserSelfUserInfoDto } from '@ying/shared'
import { SysPermissionEntity, SysUserEntity } from '@ying/db-typeorm'
import { authConfig } from '@/config'
import { dataSource } from '@/common/modules/db'
import { comparePass, generatePass, getExpTime } from '@/common/utils'
import { redis } from '@/common/modules/redis'
import { CacheKey } from '.'

export class SysAuthService {
  private readonly sysUserRepository: Repository<SysUserEntity>
  private readonly sysPermissionRepository: Repository<SysPermissionEntity>

  constructor() {
    this.sysUserRepository = dataSource.getRepository(SysUserEntity)
    this.sysPermissionRepository = dataSource.getRepository(SysPermissionEntity)
  }

  async sign(user: SysUserEntity) {
    const accessToken = await sign(
      {
        id: user.id,
        exp: getExpTime(authConfig.adminAccessTokenExpiresIn)
      },
      authConfig.adminAccessTokenSecret,
      'HS256'
    )
    const refreshTokenExpAt = getExpTime(authConfig.adminRefreshTokenExpiresIn)
    const refreshToken = await sign(
      {
        id: user.id,
        exp: refreshTokenExpAt
      },
      authConfig.adminRefreshTokenSecret,
      'HS256'
    )
    await redis.set(`${CacheKey.AdminAuthRefreshToken}:${user.id}:${refreshToken}`, 1, 'EXAT', refreshTokenExpAt)
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
      throw new HTTPException(406, { message: 'user is not exists!' })
    }
    if (!comparePass(loginDto.password, user.password)) {
      throw new HTTPException(406, { message: 'wrong password!' })
    }
    return this.sign(user)
  }

  verifyAccessToken(token: string) {
    return verify(token, authConfig.adminAccessTokenSecret, 'HS256')
  }

  verifyRefreshToken(token: string) {
    return verify(token, authConfig.adminRefreshTokenSecret, 'HS256')
  }

  async refreshToken(token: string) {
    try {
      const payload = await this.verifyRefreshToken(token)

      const existsToken = await redis.get(`${CacheKey.AdminAuthRefreshToken}:${payload.id}:${token}`)
      if (!existsToken) throw Error

      return sign(
        {
          id: payload.id,
          exp: getExpTime(authConfig.adminAccessTokenExpiresIn)
        },
        authConfig.adminAccessTokenSecret,
        'HS256'
      )
    } catch {
      throw new HTTPException(401, { message: 'Unauthorized' })
    }
  }

  async logout(userId: number, refreshToken: string) {
    await redis.del(`${CacheKey.AdminAuthRefreshToken}:${userId}:${refreshToken}`)
  }

  async getUserInfo(uid: number) {
    const sysUserEntity = await this.sysUserRepository.findOne({
      where: {
        id: uid
      },
      relations: ['roles', 'roles.permissions', 'avatar']
    })

    if (!sysUserEntity) throw new HTTPException(401)

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
      throw new HTTPException(406, { message: 'User does not exist!' })
    }
    if (!comparePass(dto.oldPass, user.password)) {
      throw new HTTPException(406, { message: 'The password is incorrect!' })
    }

    const sysUser = this.sysUserRepository.create({ id })
    sysUser.password = generatePass(dto.newPass)

    return this.sysUserRepository.save(sysUser)
  }
}
