import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { z } from 'zod'
import {
  clientLoginDto,
  clientRegisterDto,
  verifyEmailDto,
  forgotPasswordDto,
  resetPasswordWithCodeDto
} from '@ying/shared'
import { zValidator } from '@/business/base-validator'
import { authService, oauthService, requireAuth, oauthErrorHandler } from '@/business/modules/user/auth'
import { getI18n } from '@/business/i18n'
import { getRefreshTokenFromContext } from '@/common/utils'
import { authConfig } from '@/config'

export const auth = new Hono<{ Variables: AuthVariables }>()
  .post('/login', zValidator('json', clientLoginDto), async c =>
    c.json(await authService.login(c.req.valid('json'), getI18n(c)))
  )
  .get('/refresh', async c => c.json(await authService.refreshToken(getRefreshTokenFromContext(c) ?? '')))
  .post('/register', zValidator('json', clientRegisterDto), async c => {
    await authService.register(c.req.valid('json'), getI18n(c))
    return c.json(null)
  })
  .post('/verify-email', zValidator('json', verifyEmailDto), async c => {
    await authService.verifyEmail(c.req.valid('json'))
    return c.json(null)
  })
  .post('/forgot-password', zValidator('json', forgotPasswordDto), async c => {
    await authService.forgotPassword(c.req.valid('json'), getI18n(c))
    return c.json(null)
  })
  .post('/reset-password', zValidator('json', resetPasswordWithCodeDto), async c => {
    await authService.resetPassword(c.req.valid('json'))
    return c.json(null)
  })
  .get('/logout', async c => {
    const { userId } = await requireAuth(c)
    const refreshToken = getRefreshTokenFromContext(c)
    if (!refreshToken) throw new HTTPException(401, { message: 'Unauthorized' })
    await authService.logout(userId, refreshToken)
    return c.json(null)
  })

export const oauth = new Hono()
  .get('/google', async c => c.redirect(await oauthService.getGoogleLoginUrl()))
  .get(
    '/google/callback',
    zValidator(
      'query',
      z.object({
        code: z.string(),
        state: z.string()
      })
    ),
    async c => {
      const { code, state } = c.req.valid('query')
      const googleUserInfo = await oauthService.validateGoogleCallback(code, state)
      const user = await oauthService.getOrCreateOAuthAccountAndUser(googleUserInfo, 'google')
      const { accessToken, refreshToken } = await authService.sign(user)
      return c.redirect(
        `${authConfig.authClientUrl}/${c.get('language')}/auth/login?accessToken=${accessToken}&refreshToken=${refreshToken}`
      )
    }
  )
  .get('/github', async c => c.redirect(oauthService.getGitHubLoginUrl()))
  .get(
    '/github/callback',
    zValidator(
      'query',
      z.object({
        code: z.string()
      })
    ),
    async c => {
      const githubUserInfo = await oauthService.validateGitHubCallback(c.req.valid('query').code)
      const user = await oauthService.getOrCreateOAuthAccountAndUser(githubUserInfo, 'github')
      const { accessToken, refreshToken } = await authService.sign(user)
      return c.redirect(
        `${authConfig.authClientUrl}/${c.get('language')}/auth/login?accessToken=${accessToken}&refreshToken=${refreshToken}`
      )
    }
  )
  .onError(oauthErrorHandler)
