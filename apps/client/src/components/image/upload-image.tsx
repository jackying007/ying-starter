import { useState } from 'react'

import { SelectFileType, useUpload, selectFile, useDialogOpen, type UseUploadOptions } from '@ying/frontend/hooks'
import type { FileEntity } from '@ying/shared'
import { cn } from '@ying/frontend/ui'
import { PlusIcon, LoadingIconV1 } from '@ying/frontend/icons'

import { CropImageModal } from './crop-image-modal'

type UploadProps = UseUploadOptions<FileEntity> & {
  className?: string
  disabled?: boolean
  defaultUrl?: string
  withCrop?: boolean
  aspectRatio?: number
}

export const UploadImage = ({
  className,
  disabled,
  defaultUrl,
  withCrop,
  aspectRatio,
  onSuccess,
  handleUpload
}: UploadProps) => {
  const [url, setUrl] = useState(defaultUrl)

  const { loading, startUpload } = useUpload({
    handleUpload,
    onSuccess: fileEntity => {
      if (!fileEntity) return
      setUrl(fileEntity.url)
      onSuccess?.(fileEntity)
    }
  })

  const cropModalProps = useDialogOpen<File>()

  const handleSelect = async () => {
    if (disabled) return
    const file = await selectFile(SelectFileType.Image)
    if (withCrop) {
      cropModalProps.onOpen(file)
    } else {
      startUpload(file)
    }
  }

  return (
    <>
      <div
        className={cn('inline-block w-32 h-32 cursor-pointer', className, disabled && 'grayscale')}
        onClick={handleSelect}
      >
        <div className="w-full h-full fc overflow-hidden rounded-md border shadow-sm text-muted-foreground bg-muted">
          {loading ? (
            <LoadingIconV1 />
          ) : url ? (
            <img className="w-full h-full object-cover" src={url} alt="image" />
          ) : (
            <PlusIcon className="text-5xl" />
          )}
        </div>
      </div>
      <CropImageModal {...cropModalProps} onCrop={res => startUpload(res.file)} aspectRatio={aspectRatio} />
    </>
  )
}
