import type { BaseType } from 'antd/es/typography/Base'

import { BasicStatus, FileType, FileSourceType } from '@ying/shared'
import { getScrollbarThickness } from '@ying/shared-web'

export type TypeOption<T> = {
  label: string
  value: T
}

export type BasicStatusOption = TypeOption<BasicStatus> & {
  color: BaseType
}

export const BasicStatusOptions: BasicStatusOption[] = [
  {
    value: BasicStatus.ENABLE,
    color: 'success',
    label: '可用'
  },
  {
    value: BasicStatus.DISABLE,
    color: 'warning',
    label: '禁用'
  }
]

export type FileTypeOption = TypeOption<FileType>

export const FileTypeOptions: FileTypeOption[] = [
  {
    value: FileType.Image,
    label: '图片'
  },
  {
    value: FileType.Video,
    label: '视频'
  }
]

export type FileSourceTypeOption = TypeOption<FileSourceType>

export const FileSourceTypeOptions: FileSourceTypeOption[] = [
  {
    value: FileSourceType.Admin,
    label: '后台'
  },
  {
    value: FileSourceType.Client,
    label: '客户端'
  }
]

export const ScrollbarThickness = getScrollbarThickness()
