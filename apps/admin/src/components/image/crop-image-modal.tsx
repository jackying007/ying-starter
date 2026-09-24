import { useRef } from 'react'
import { Modal } from 'antd'
import { useDialogOpen } from '@ying/shared-react/hooks'
import { CropImage, type TCropImageHandle, type TSaveRes } from '@ying/shared-react/components'

export type CropImageModalProps = ReturnType<typeof useDialogOpen<File>> & {
  onCrop?: (res: TSaveRes) => void
  aspectRatio?: number
}

export const CropImageModal = ({ open, onClose, formValue: file, aspectRatio, onCrop }: CropImageModalProps) => {
  const ref = useRef<TCropImageHandle>(null)

  const onOk = async () => {
    if (!ref.current) return
    const res = await ref.current.save()
    if (res) {
      onCrop?.(res)
    }
    onClose()
  }

  return (
    <Modal title="裁剪图片" open={open} onCancel={onClose} onOk={onOk}>
      {file && (
        <CropImage
          ref={ref}
          url={URL.createObjectURL(file)}
          type={file.type}
          name={file.name}
          aspectRatio={aspectRatio}
        />
      )}
    </Modal>
  )
}
