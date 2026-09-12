import { DeviceType, PushTaskStatus } from '@ying/shared'
import { CreatePushTaskDto } from '@ying/shared'

export const defaultValues: Partial<CreatePushTaskDto> = {
  name: undefined,
  deviceType: undefined,
  pushTemplateId: undefined
}

export type DeviceTypeOption = { value: DeviceType; label: string }

export const DeviceTypeOptions: DeviceTypeOption[] = [
  {
    value: DeviceType.Windows,
    label: 'windows'
  },
  {
    value: DeviceType.Android,
    label: 'android'
  },
  {
    value: DeviceType.Ios,
    label: 'ios'
  },
  {
    value: DeviceType.MacOs,
    label: 'mac os'
  },
  {
    value: DeviceType.Others,
    label: '其他'
  }
]

export type PushTaskStatusOption = { value: PushTaskStatus; label: string }

export const PushTaskStatusOptions: PushTaskStatusOption[] = [
  {
    value: PushTaskStatus.Wait,
    label: '待设置'
  },
  {
    value: PushTaskStatus.WaitExecute,
    label: '待执行'
  },
  {
    value: PushTaskStatus.Executing,
    label: '执行中'
  },
  {
    value: PushTaskStatus.Done,
    label: '已结束'
  }
]
