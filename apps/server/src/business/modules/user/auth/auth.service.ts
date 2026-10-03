import { sign, verify } from 'hono/jwt'
import { HTTPException } from 'hono/http-exception'
import { customAlphabet } from 'nanoid'
import { eq } from 'drizzle-orm'
import type {
  ClientLoginDto,
  ClientRegisterDto,
  VerifyEmailDto,
  ForgotPasswordDto,
  ResetPasswordWithCodeDto
} from '@ying/shared'
import { userTable } from '@ying/db-drizzle/schema'
import { authConfig } from '@/config'
import { redis } from '@/common/modules/redis'
import { mailService } from '@/common/modules/mail'
import { generatePass, getExpTime } from '@/common/utils'
import { db } from '@/common/modules/db'
import type { I18nVariables } from '@/business/i18n'
import { wrapBaseVo } from '@/business/base.vo'
import { CacheKey } from '.'

const randomCode = customAlphabet('0123456789', 6)

export class AuthService {
  async generateEmailVerificationCode(email: string) {
    const key = `${CacheKey.EmailVerificationCode}:${email}`
    const existingCode = await redis.get(key)
    if (existingCode) {
      await redis.del(key)
    }
    const code = randomCode()
    await redis.set(key, code, 'EX', 5 * 60)
    return code
  }

  async verifyEmailVerificationCode(dto: VerifyEmailDto) {
    const key = `${CacheKey.EmailVerificationCode}:${dto.email}`
    const code = await redis.get(key)
    if (!code || code !== dto.code) return false
    await redis.del(key)
    return true
  }

  async register(dto: ClientRegisterDto, t: I18nVariables['t']) {
    await db.transaction(async tx => {
      const existingUser = await tx.query.userTable.findFirst({
        where: { email: dto.email }
      })
      if (existingUser && existingUser.emailVerified) {
        throw new HTTPException(500, { message: 'error.the_email_has_been_registered' })
      }

      if (existingUser) {
        await tx
          .update(userTable)
          .set({
            name: dto.name,
            emailVerified: false,
            password: generatePass(dto.password)
          })
          .where(eq(userTable.email, dto.email))
      } else {
        await tx.insert(userTable).values({
          ...dto,
          emailVerified: false,
          password: generatePass(dto.password)
        })
      }

      const code = await this.generateEmailVerificationCode(dto.email)
      const title = t('emailVerificationTitle')
      const content = t('emailVerificationContent', { code })
      await mailService.sendMail(dto.email, title, content)
    })
  }

  async verifyEmail(dto: VerifyEmailDto) {
    const isValid = await this.verifyEmailVerificationCode(dto)
    if (!isValid) throw new HTTPException(500, { message: 'error.code_is_invalid' })
    await db.update(userTable).set({ emailVerified: true }).where(eq(userTable.email, dto.email))
  }

  async signUser(user: typeof userTable.$inferSelect) {
    const accessToken = await sign(
      {
        id: user.id,
        exp: getExpTime(authConfig.clientAccessTokenExpiresIn)
      },
      authConfig.clientAccessTokenSecret,
      'HS256'
    )
    const refreshTokenExpAt = getExpTime(authConfig.clientRefreshTokenExpiresIn)
    const refreshToken = await sign(
      {
        id: user.id,
        exp: refreshTokenExpAt
      },
      authConfig.clientRefreshTokenSecret,
      'HS256'
    )
    await redis.set(`${CacheKey.ClientAuthRefreshToken}:${user.id}:${refreshToken}`, 1, 'EXAT', refreshTokenExpAt)
    return {
      accessToken,
      refreshToken
    }
  }

  async login(dto: ClientLoginDto, t: I18nVariables['t']) {
    const user = await db.query.userTable.findFirst({
      where: {
        email: dto.email
      }
    })
    if (!user) throw new HTTPException(500, { message: 'error.email_does_not_exist' })
    if (user.password !== generatePass(dto.password)) throw new HTTPException(500, { message: 'error.password_error' })
    if (!user.emailVerified) {
      const code = await this.generateEmailVerificationCode(user.email)
      const title = t('emailVerificationTitle')
      const content = t('emailVerificationContent', { code })
      await mailService.sendMail(dto.email, title, content)
      return wrapBaseVo('emailNotVerified', undefined)
    }
    return wrapBaseVo(0, await this.signUser(user))
  }

  verifyAccessToken(token: string) {
    return verify(token, authConfig.clientAccessTokenSecret, 'HS256')
  }

  verifyRefreshToken(token: string) {
    return verify(token, authConfig.clientRefreshTokenSecret, 'HS256')
  }

  async refreshToken(token: string) {
    try {
      const payload = await this.verifyRefreshToken(token)

      const existsToken = await redis.get(`${CacheKey.ClientAuthRefreshToken}:${payload.id}:${token}`)
      if (!existsToken) throw Error

      return sign(
        {
          id: payload.id,
          exp: getExpTime(authConfig.clientAccessTokenExpiresIn)
        },
        authConfig.clientAccessTokenSecret,
        'HS256'
      )
    } catch {
      throw new HTTPException(401, { message: 'Unauthorized' })
    }
  }

  async logout(userId: number, refreshToken: string) {
    await redis.del(`${CacheKey.ClientAuthRefreshToken}:${userId}:${refreshToken}`)
  }

  async forgotPassword(dto: ForgotPasswordDto, t: I18nVariables['t']) {
    const existingUser = await db.query.userTable.findFirst({
      where: { email: dto.email }
    })
    if (!existingUser) throw new HTTPException(500, { message: 'error.email_does_not_exist' })

    const code = await this.generateEmailVerificationCode(dto.email)
    const title = t('emailVerificationTitle')
    const content = t('emailVerificationContent', { code })
    await mailService.sendMail(dto.email, title, content)
  }

  async resetPassword(dto: ResetPasswordWithCodeDto) {
    const isValid = await this.verifyEmailVerificationCode(dto)
    if (!isValid) throw new HTTPException(500, { message: 'error.code_is_invalid' })

    await db
      .update(userTable)
      .set({ password: generatePass(dto.password) })
      .where(eq(userTable.email, dto.email))
  }
}
