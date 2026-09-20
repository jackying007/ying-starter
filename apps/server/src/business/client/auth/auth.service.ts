import { Inject, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import type { ConfigType } from '@nestjs/config'
import { DataSource, Repository } from 'typeorm'
import { customAlphabet } from 'nanoid'
import { I18nContext } from 'nestjs-i18n'
import ms from 'ms'
import { Redis } from 'ioredis'
import { UserEntity } from '@ying/shared'
import type {
  ClientLoginDto,
  ClientRegisterDto,
  VerifyEmailDto,
  ForgotPasswordDto,
  ResetPasswordWithCodeDto
} from '@ying/shared'
import type { ClientAuthVo, ClientLoginVo } from '@ying/shared'
import { wrapBaseVo } from '@ying/shared'
import { authConfig } from '@/config'
import { RedisToken } from '@/common/modules/redis/constant'
import { MailService } from '@/common/modules/mail/mail.service'
import { generatePass } from '@/common/utils'
import { CacheKey } from './constant'

const randomCode = customAlphabet('0123456789', 6)

type VerifiedData = TClientPayload & {
  iat?: any
  exp?: any
}

@Injectable()
export class AuthService {
  @Inject()
  private readonly jwtService: JwtService
  @InjectDataSource()
  private dataSource: DataSource
  @InjectRepository(UserEntity)
  private userRepository: Repository<UserEntity>
  @Inject(RedisToken)
  private readonly redis: Redis
  @Inject(authConfig.KEY)
  private readonly authConf: ConfigType<typeof authConfig>
  @Inject()
  private readonly mailService: MailService

  async generateEmailVerificationCode(email: string) {
    const key = `${CacheKey.EmailVerificationCode}:${email}`
    const existingCode = await this.redis.get(key)
    if (existingCode) {
      await this.redis.del(key)
    }
    const code = randomCode()
    await this.redis.set(key, code, 'EX', ms('5m') / 1000)
    return code
  }

  async verifyEmailVerificationCode(dto: VerifyEmailDto) {
    const key = `${CacheKey.EmailVerificationCode}:${dto.email}`
    const code = await this.redis.get(key)
    if (!code || code !== dto.code) {
      return false
    }
    await this.redis.del(key)
    return true
  }

  async register(dto: ClientRegisterDto) {
    await this.dataSource.transaction(async transaction => {
      const existingUser = await transaction.findOne(UserEntity, {
        where: { email: dto.email }
      })

      if (existingUser && existingUser.emailVerified) {
        throw new InternalServerErrorException('error.the_email_has_been_registered')
      }

      if (existingUser) {
        existingUser.password = generatePass(dto.password)
        existingUser.name = dto.name
        existingUser.emailVerified = false

        await transaction.save(existingUser)
      } else {
        const newUser = transaction.create(UserEntity, {
          ...dto,
          emailVerified: false,
          password: generatePass(dto.password)
        })

        await transaction.save(newUser)
      }

      const code = await this.generateEmailVerificationCode(dto.email)
      const i18n = I18nContext.current()
      if (i18n) {
        const title = i18n.t('auth.emailVerificationTitle')
        const content = i18n.t('auth.emailVerificationContent', { args: { code } })
        await this.mailService.sendMail(dto.email, title, content)
      }
    })
  }

  async verifyEmail(dto: VerifyEmailDto) {
    const isValid = await this.verifyEmailVerificationCode(dto)
    if (!isValid) throw new InternalServerErrorException('error.code_is_invalid')
    await this.userRepository.update({ email: dto.email }, { emailVerified: true })
  }

  async sign(user: UserEntity): Promise<ClientAuthVo> {
    const payload: TClientPayload = {
      id: user.id
    }
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.authConf.clientAccessTokenSecret,
      expiresIn: this.authConf.clientAccessTokenExpiresIn
    })
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.authConf.clientRefreshTokenSecret,
      expiresIn: this.authConf.clientRefreshTokenExpiresIn
    })
    await this.redis.set(
      `${CacheKey.ClientAuthAccessToken}:${user.id}:${accessToken}`,
      refreshToken,
      'EX',
      ms(this.authConf.clientRefreshTokenExpiresIn) / 1000
    )
    await this.redis.set(
      `${CacheKey.ClientAuthRefreshToken}:${user.id}:${refreshToken}`,
      user.id,
      'EX',
      ms(this.authConf.clientRefreshTokenExpiresIn) / 1000
    )
    return {
      accessToken,
      refreshToken
    }
  }

  async login(dto: ClientLoginDto): Promise<ClientLoginVo> {
    const user = await this.userRepository.findOne({
      where: {
        email: dto.email
      }
    })
    if (!user) throw new InternalServerErrorException('error.email_does_not_exist')
    if (user.password !== generatePass(dto.password)) throw new InternalServerErrorException('error.password_error')
    if (!user.emailVerified) {
      const code = await this.generateEmailVerificationCode(user.email)
      const i18n = I18nContext.current()
      if (i18n) {
        const title = i18n.t('auth.emailVerificationTitle')
        const content = i18n.t('auth.emailVerificationContent', { args: { code } })
        await this.mailService.sendMail(dto.email, title, content)
      }
      return wrapBaseVo('emailNotVerified', undefined)
    }
    return wrapBaseVo(0, await this.sign(user))
  }

  verifyAccessToken(token: string) {
    return this.jwtService.verifyAsync<VerifiedData>(token, {
      secret: this.authConf.clientAccessTokenSecret
    })
  }

  verifyRefreshToken(token: string) {
    return this.jwtService.verifyAsync<VerifiedData>(token, {
      secret: this.authConf.clientRefreshTokenSecret
    })
  }

  async refreshToken(token: string) {
    try {
      const payload = await this.verifyRefreshToken(token)

      const existsToken = await this.redis.get(`${CacheKey.ClientAuthRefreshToken}:${payload.id}:${token}`)
      if (!existsToken) throw new UnauthorizedException()

      delete payload.iat
      delete payload.exp

      const accessToken = await this.jwtService.signAsync(payload, {
        secret: this.authConf.clientAccessTokenSecret,
        expiresIn: this.authConf.clientAccessTokenExpiresIn
      })

      await this.redis.set(
        `${CacheKey.ClientAuthAccessToken}:${payload.id}:${accessToken}`,
        token,
        'EX',
        ms(this.authConf.clientAccessTokenExpiresIn) / 1000
      )
      return accessToken
    } catch {
      throw new UnauthorizedException()
    }
  }

  async logout(token: string, userId: number) {
    const accessTokenKey = `${CacheKey.ClientAuthAccessToken}:${userId}:${token}`
    const refreshToken = await this.redis.get(accessTokenKey)
    await this.redis.del(accessTokenKey)
    await this.redis.del(`${CacheKey.ClientAuthRefreshToken}:${userId}:${refreshToken}`)
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: dto.email }
    })

    if (!existingUser) throw new InternalServerErrorException('error.email_does_not_exist')

    const code = await this.generateEmailVerificationCode(dto.email)
    const i18n = I18nContext.current()
    if (i18n) {
      const title = i18n.t('auth.emailVerificationTitle')
      const content = i18n.t('auth.emailVerificationContent', { args: { code } })
      await this.mailService.sendMail(dto.email, title, content)
    }
  }

  async resetPassword(dto: ResetPasswordWithCodeDto) {
    const isValid = await this.verifyEmailVerificationCode(dto)
    if (!isValid) throw new InternalServerErrorException('error.code_is_invalid')
    await this.userRepository.update({ email: dto.email }, { password: generatePass(dto.password) })
  }
}
