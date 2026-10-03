import { generateCodeVerifier, decodeIdToken, Google, GitHub } from 'arctic'
import { nanoid } from 'nanoid'
import type { OAuthProvider } from '@ying/shared'
import { userTable, oauthAccountTable } from '@ying/db-drizzle/schema'
import { authConfig } from '@/config'
import { redis } from '@/common/modules/redis'
import { db } from '@/common/modules/db'
import { CacheKey } from '.'

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

export class OAuthService {
  readonly google: Google
  readonly gitHub: GitHub
  constructor() {
    this.google = new Google(
      authConfig.googleId!,
      authConfig.googleSecret!,
      `${authConfig.oauthCallbackBaseUrl}/api/client/auth/google/callback`
    )
    this.gitHub = new GitHub(
      authConfig.githubId!,
      authConfig.githubSecret!,
      `${authConfig.oauthCallbackBaseUrl}/api/client/auth/github/callback`
    )
  }

  async getOrCreateOAuthAccountAndUser(oauthAccountInfo: OAuthAccountInfo, provider: OAuthProvider) {
    const { providerAccountId, name, email, emailVerified, avatar } = oauthAccountInfo

    const user = await db.transaction(async tx => {
      const existOAuthAccount = await tx.query.oauthAccountTable.findFirst({
        where: { providerAccountId, provider },
        with: {
          user: true
        }
      })

      if (existOAuthAccount?.user) return existOAuthAccount.user

      let user = await tx.query.userTable.findFirst({
        where: {
          email
        }
      })

      if (!user) {
        ;[user] = await tx
          .insert(userTable)
          .values({
            name,
            email,
            emailVerified
          })
          .returning()
      }

      await tx.insert(oauthAccountTable).values({
        provider,
        providerAccountId,
        name,
        avatar,
        userId: user.id
      })

      return user
    })

    return user
  }

  async createGoogleAuthURL() {
    const state = nanoid()
    const codeVerifier = generateCodeVerifier()
    await redis.set(`${CacheKey.OAuth}:${state}`, codeVerifier, 'EX', 5 * 60)
    return this.google.createAuthorizationURL(`${state}`, codeVerifier, ['profile', 'email'])
  }

  async getGoogleLoginUrl() {
    return (await this.createGoogleAuthURL()).toString()
  }

  async validateGoogleCallback(code: string, state: string): Promise<OAuthAccountInfo> {
    const key = `${CacheKey.OAuth}:${state}`
    const codeVerifier = await redis.get(key)
    if (!codeVerifier) {
      throw new Error('Invalid or expired state')
    }
    await redis.del(key)
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
