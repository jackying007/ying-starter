import type { Dispatch, Ref, SetStateAction } from 'react'
import { useImperativeHandle, useState } from 'react'
import { Modal } from 'antd'
import type { FileVo } from '@ying/server/types-admin'
import { ImageList } from './image-list'

export type ImageSelectorModalRefHandle = {
  setSelectedFiles: Dispatch<SetStateAction<FileVo[]>>
}

export type ImageSelectorModalProps = {
  defaultFiles?: FileVo[]
  open: boolean
  onSelect: (files: FileVo[]) => void
  onCancel: VoidFunction
  maxLength?: number
  ref?: Ref<ImageSelectorModalRefHandle>
}

export const ImageSelectorModal = ({
  defaultFiles,
  open,
  onSelect,
  onCancel,
  maxLength = 1,
  ref
}: ImageSelectorModalProps) => {
  const [selectedFiles, setSelectedFiles] = useState<FileVo[]>(defaultFiles ?? [])

  const onOk = () => {
    onSelect(selectedFiles)
    onCancel()
  }

  useImperativeHandle(
    ref,
    () => ({
      setSelectedFiles
    }),
    []
  )

  return (
    <Modal open={open} onCancel={onCancel} width="1040px" title="选择图片" onOk={onOk}>
      <ImageList selectedFiles={selectedFiles} setSelectedFiles={setSelectedFiles} maxLength={maxLength} />
    </Modal>
  )
}
