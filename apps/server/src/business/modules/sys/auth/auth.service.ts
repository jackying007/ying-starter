import { HTTPException } from 'hono/http-exception'
import { sign, verify } from 'hono/jwt'
import { eq } from 'drizzle-orm'
import { uniqueBy } from '@ying/utils'
import { BasicStatus } from '@ying/shared'
import type { AdminLoginDto, UpdateSysUserSelfPasswordDto, UpdateSysUserSelfUserInfoDto } from '@ying/shared'
import { sysPermissionTable, sysUserTable } from '@ying/db-drizzle/schema'
import { authConfig } from '@/config'
import { db } from '@/common/modules/db'
import { comparePass, generatePass, getExpTime } from '@/common/utils'
import { redis } from '@/common/modules/redis'
import { CacheKey } from '.'

type TSysPermission = typeof sysPermissionTable.$inferSelect

export class SysAuthService {
  async signUser(user: typeof sysUserTable.$inferSelect) {
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

  async login(dto: AdminLoginDto) {
    const { username, password } = dto
    const user = await db.query.sysUserTable.findFirst({
      where: {
        OR: [
          {
            account: username
          },
          {
            email: username
          }
        ]
      }
    })
    if (!user) throw new HTTPException(406, { message: 'user is not exists!' })
    if (!comparePass(password, user.password)) throw new HTTPException(406, { message: 'wrong password!' })

    return this.signUser(user)
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

  async getUserInfo(id: number) {
    const sysUser = await db.query.sysUserTable.findFirst({
      columns: {
        password: false
      },
      where: {
        id
      },
      with: {
        roles: {
          where: {
            status: BasicStatus.ENABLE
          },
          with: {
            permissions: true
          }
        },
        avatar: true
      }
    })
    if (!sysUser) throw new HTTPException(500, { message: 'user is not exist' })

    let permissions: TSysPermission[] = uniqueBy(
      sysUser.roles.reduce((prev, cur) => [...prev, ...cur.permissions], [] as TSysPermission[]),
      'code'
    )
    const isSuperAdmin = sysUser.roles.some(el => el.systemic)
    if (isSuperAdmin) {
      permissions = await db.query.sysPermissionTable.findMany()
    }
    permissions = permissions.sort((a, b) => a.sort - b.sort)
    return {
      ...sysUser,
      permissions
    }
  }

  async updateUserInfo(id: number, dto: UpdateSysUserSelfUserInfoDto) {
    await db.update(sysUserTable).set(dto).where(eq(sysUserTable.id, id))
  }

  async updateUserPassword(id: number, dto: UpdateSysUserSelfPasswordDto) {
    const user = await db.query.sysUserTable.findFirst({ where: { id } })
    if (!user) throw new HTTPException(406, { message: 'User does not exist!' })
    if (!comparePass(dto.oldPass, user.password))
      throw new HTTPException(406, { message: 'The password is incorrect!' })

    await db
      .update(sysUserTable)
      .set({
        password: generatePass(dto.newPass)
      })
      .where(eq(sysUserTable.id, id))
  }
}
