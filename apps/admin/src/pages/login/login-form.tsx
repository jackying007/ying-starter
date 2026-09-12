import { App, Button, Card, Form, Input } from 'antd'
import { useCallback, useState } from 'react'
import type { AdminLoginDto } from '@ying/shared'

import { setAccessToken, setRefreshToken, setUserInfo } from '@/store'
import { authApi } from '@/api'

import { LoginStateEnum, useLoginStateContext } from './provider'

const useSignIn = () => {
  const { notification } = App.useApp()

  const signIn = useCallback(
    async (data: AdminLoginDto) => {
      const authTokens = await authApi.login(data)
      setAccessToken(authTokens.accessToken)
      setRefreshToken(authTokens.refreshToken)
      const userInfo = await authApi.getUserInfo()
      setUserInfo(userInfo)

      setTimeout(() => {
        notification.success({
          title: '登录成功',
          description: `欢迎回来: ${userInfo.name}`,
          duration: 2
        })
      }, 300)
    },
    [notification]
  )

  return signIn
}

export function LoginForm() {
  const [loading, setLoading] = useState(false)

  const { loginState } = useLoginStateContext()
  const signIn = useSignIn()

  if (loginState !== LoginStateEnum.LOGIN) return null

  const handleFinish = async ({ username, password }: AdminLoginDto) => {
    setLoading(true)
    try {
      await signIn({ username, password })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card title="登录" className="w-full max-w-xs">
      <Form name="login" layout="vertical" onFinish={handleFinish}>
        <Form.Item label="账号" name="username" rules={[{ required: true, message: '请输入账号' }]}>
          <Input placeholder="账号" />
        </Form.Item>
        <Form.Item label="密码" name="password" rules={[{ required: true, message: '请输入密码' }]}>
          <Input.Password type="password" placeholder="密码" />
        </Form.Item>
        <Button type="primary" htmlType="submit" className="w-full mt-4" loading={loading}>
          登录
        </Button>
      </Form>
    </Card>
  )
}
