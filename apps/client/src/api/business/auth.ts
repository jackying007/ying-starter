import type { HttpRequest } from '@jying/http'
import type {
  ClientLoginDto,
  ClientRegisterDto,
  VerifyEmailDto,
  ForgotPasswordDto,
  ResetPasswordWithCodeDto
} from '@ying/shared'
import type { AuthLoginVo } from '@ying/server/types-client'

export default function (http: HttpRequest) {
  return {
    login(data: ClientLoginDto) {
      return http.post<AuthLoginVo>('/auth/login', { data, skipAfterResponse: true })
    },
    logout() {
      return http.get<void>('/auth/logout')
    },
    register(data: ClientRegisterDto) {
      return http.post<void>('/auth/register', { data })
    },
    verifyEmail(data: VerifyEmailDto) {
      return http.post<void>('/auth/verify-email', { data })
    },
    forgotPassword(data: ForgotPasswordDto) {
      return http.post<void>('/auth/forgot-password', { data })
    },
    resetPassword(data: ResetPasswordWithCodeDto) {
      return http.post<void>('/auth/reset-password', { data })
    }
  }
}
