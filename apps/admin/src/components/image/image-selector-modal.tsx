import type { Dispatch, Ref, SetStateAction } from 'react'
import { useImperativeHandle, useState } from 'react'
import { Modal } from 'antd'

import type { FileEntity } from '@ying/shared/entity'

import { ImageList } from './image-list'

export type ImageSelectorModalRefHandle = {
  setSelectedFiles: Dispatch<SetStateAction<FileEntity[]>>
}

export type ImageSelectorModalProps = {
  defaultFiles?: FileEntity[]
  open: boolean
  onSelect: (files: FileEntity[]) => void
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
  const [selectedFiles, setSelectedFiles] = useState<FileEntity[]>(defaultFiles ?? [])

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
