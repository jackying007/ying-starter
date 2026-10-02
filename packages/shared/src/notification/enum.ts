export type { PushSubscription } from 'web-push'

export type PushData = {
  title: string
  body?: string
  link?: string
  image?: string
  actions?: {
    title: string
    link?: string
  }[]
}

export enum DeviceType {
  Windows = 'windows',
  MacOs = 'mac os',
  Android = 'android',
  Ios = 'ios',
  Others = 'others'
}

export enum PushTaskStatus {
  Wait,
  WaitExecute,
  Executing,
  Done
}

export type TaskStatus = {
  pushing: number
  success: number
  fail: number
  click: number
}

export enum PushRecordStatus {
  Pushing,
  Success,
  Fail
}
