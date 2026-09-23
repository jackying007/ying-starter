import { AuthService } from './auth.service'
import { OAuthService } from './oauth.service'

export const authService = new AuthService()
export const oauthService = new OAuthService()

export * from './constant'
export * from './require.auth'
export * from './auth.validator'
export * from './oauth.error.handler'
