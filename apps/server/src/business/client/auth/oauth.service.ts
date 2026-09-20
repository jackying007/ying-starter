import { Inject, Injectable } from '@nestjs/common'
import type { ConfigType } from '@nestjs/config'
import { generateCodeVerifier, decodeIdToken, Google, GitHub } from 'arctic'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { nanoid } from 'nanoid'
import { Redis } from 'ioredis'
import { type OAuthProvider, OAuthAccountEntity, UserEntity } from '@ying/shared'
import { authConfig } from '@/config'
import { RedisToken } from '@/common/modules/redis'
import { CacheKey } from './constant'

export type OAuthAccountInfo = {
  providerAccountId: string
  email: string
  emailVerified: boolean
  name: string
  avatar: string
}

type GoogleUserInfo = {
  sub: string
  email: string
  email_verified: boolean
  name: string
  picture: string
}

@Injectable()
export class OAuthService {
  readonly google: Google
  readonly gitHub: GitHub
  constructor(
    @Inject(authConfig.KEY)
    private readonly authConf: ConfigType<typeof authConfig>,
    @Inject(RedisToken)
    private readonly redis: Redis,
    @InjectDataSource()
    private dataSource: DataSource
  ) {
    this.google = new Google(
      this.authConf.googleId!,
      this.authConf.googleSecret!,
      `${this.authConf.oauthCallbackBaseUrl}/api/client/auth/google/callback`
    )
    this.gitHub = new GitHub(
      this.authConf.githubId!,
      this.authConf.githubSecret!,
      `${this.authConf.oauthCallbackBaseUrl}/api/client/auth/github/callback`
    )
  }

  async getOrCreateOAuthAccountAndUser(oauthAccountInfo: OAuthAccountInfo, provider: OAuthProvider) {
    const { providerAccountId, name, email, emailVerified, avatar } = oauthAccountInfo
    const user = await this.dataSource.transaction(async transaction => {
      const existOAuthAccount = await this.dataSource.getRepository(OAuthAccountEntity).findOne({
        where: { providerAccountId, provider },
        relations: ['user']
      })

      if (existOAuthAccount && existOAuthAccount.user) {
        return existOAuthAccount.user
      }

      let user = await this.dataSource.getRepository(UserEntity).findOne({
        where: { email }
      })
      if (!user) {
        user = transaction.create(UserEntity, {
          name,
          email,
          emailVerified
        })
        await transaction.save(user)
      }

      const newOAuthAccount = transaction.create(OAuthAccountEntity, {
        provider,
        providerAccountId,
        name,
        avatar,
        userId: user.id
      })
      await transaction.save(newOAuthAccount)
      return user
    })
    return user
  }

  async createGoogleAuthURL() {
    const state = nanoid()
    const codeVerifier = generateCodeVerifier()
    await this.redis.set(`${CacheKey.OAuth}:${state}`, codeVerifier, 'EX', 5 * 60)
    return this.google.createAuthorizationURL(`${state}`, codeVerifier, ['profile', 'email'])
  }

  async getGoogleLoginUrl() {
    return (await this.createGoogleAuthURL()).toString()
  }

  async validateGoogleCallback(code: string, state: string): Promise<OAuthAccountInfo> {
    const key = `${CacheKey.OAuth}:${state}`
    const codeVerifier = await this.redis.get(key)
    if (!codeVerifier) {
      throw new Error('Invalid or expired state')
    }
    await this.redis.del(key)
    const tokens = await this.google.validateAuthorizationCode(code, codeVerifier)
    const idToken = tokens.idToken()
    const info = decodeIdToken(idToken) as GoogleUserInfo
    return {
      providerAccountId: info.sub,
      email: info.email,
      emailVerified: info.email_verified,
      name: info.name,
      avatar: info.picture
    }
  }

  createGitHubAuthURL() {
    const state = nanoid()
    return this.gitHub.createAuthorizationURL(state, ['user:email'])
  }

  getGitHubLoginUrl() {
    return this.createGitHubAuthURL().toString()
  }

  async validateGitHubCallback(code: string): Promise<OAuthAccountInfo> {
    const tokens = await this.gitHub.validateAuthorizationCode(code)
    const accessToken = tokens.accessToken()
    const responses = await Promise.all([
      fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }),
      fetch('https://api.github.com/user/emails', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
    ])
    const [info, emails] = (await Promise.all([responses[0].json(), responses[1].json()])) as [
      {
        id: number
        name: string
        avatar_url: string
      },
      {
        email: string
        verified: boolean
      }[]
    ]
    return {
      providerAccountId: String(info.id),
      email: emails[0].email,
      emailVerified: emails[0].verified,
      name: info.name,
      avatar: info.avatar_url
    }
  }
}
