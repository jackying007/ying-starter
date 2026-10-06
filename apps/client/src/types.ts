import type { i18n } from 'i18next'
import type { PropsWithChildren } from 'react'

export type PropsWithClassName = {
  className?: string
}

export type PropsWithClassAndChild = PropsWithChildren & PropsWithClassName

export type AppRouterContext = {
  i18n: i18n
  auth: {
    accessToken?: string
    refreshToken?: string
  }
}
