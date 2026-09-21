import { Context } from 'hono'
import { getCookie } from 'hono/cookie'
import ms, { type StringValue } from 'ms'

export function parseAuthHeader(headerValue: string) {
  if (typeof headerValue !== 'string') {
    return null
  }
  const matches = headerValue.match(/(\S+)\s+(\S+)/)
  return matches && { scheme: matches[1], value: matches[2] }
}

export function getTokenFromAuthorization(authorization: string | undefined) {
  if (authorization) {
    const authParams = parseAuthHeader(authorization)
    if (authParams && 'bearer' === authParams.scheme.toLowerCase()) {
      return authParams.value
    }
  }
}

export function getAccessTokenFromContext(c: Context) {
  return getTokenFromAuthorization(c.req.header('Authorization')) ?? getCookie(c, 'accessToken')
}

export function getRefreshTokenFromContext(c: Context) {
  return c.req.header('refreshToken') ?? getCookie(c, 'refreshToken')
}

export function getExpTime(expiresIn: StringValue) {
  return Math.floor((Date.now() + ms(expiresIn)) / 1000)
}
