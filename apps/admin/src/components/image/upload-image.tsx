import { useState } from 'react'
import { PlusOutlined, BorderInnerOutlined, Loading3QuartersOutlined } from '@ant-design/icons'
import { SelectFileType, selectFile, useUpload, type UseUploadOptions, useDialogOpen } from '@ying/shared-react/hooks'
import { cn } from '@ying/shared-react/ui'
import type { FileVo } from '@ying/server/types-admin'
import { CropImageModal } from './crop-image-modal'

type UploadProps = UseUploadOptions<FileVo> & {
  className?: string
  defaultUrl?: string
  mustCrop?: boolean
  aspectRatio?: number
  willSetUrl?: boolean
}

type SelectType = 'direct' | 'crop'

export const UploadImage = ({
  handleUpload,
  onSuccess,
  onError,
  className,
  defaultUrl,
  mustCrop,
  aspectRatio,
  willSetUrl = true
}: UploadProps) => {
  const [url, setUrl] = useState<string>()
  const showUrl = url ?? defaultUrl

  const { loading, startUpload } = useUpload<FileVo>({
    handleUpload,
    onSuccess: fileEntity => {
      if (willSetUrl) setUrl(fileEntity.url)
      onSuccess?.(fileEntity)
    },
    onError
  })

  const cropModalProps = useDialogOpen<File>()

  const handleSelectFile = async (type: SelectType) => {
    const file = await selectFile(SelectFileType.Image)

    if (type === 'crop') {
      cropModalProps.onOpen(file)
    } else {
      startUpload(file)
    }
  }

  return (
    <>
      <div
        className={cn(
          'fc inline-flex w-27.5 h-27.5 overflow-hidden rounded-md shadow-xs border border-border text-2xl bg-hover relative group',
          className
        )}
      >
        {loading ? (
          <Loading3QuartersOutlined className="animate-spin" />
        ) : showUrl ? (
          <img className="w-full h-full object-cover" src={showUrl} />
        ) : (
          <PlusOutlined className="transition-opacity duration-300 group-hover:opacity-0" />
        )}
        <div className="w-full h-full absolute left-0 top-0 bg-black/20 transition-opacity duration-300 opacity-0 group-hover:opacity-100 fc flex-col gap-2 text-base text-white/90">
          <div
            className="rounded-md px-2 py-1.5 bg-white/40 hover:bg-white/50 cursor-pointer flex items-center gap-1"
            onClick={() => handleSelectFile('crop')}
          >
            <BorderInnerOutlined />
            <span className="text-sm">裁剪</span>
          </div>
          {!mustCrop && (
            <div
              className="rounded-md px-2 py-1.5 bg-white/40 hover:bg-white/50 cursor-pointer flex items-center gap-1"
              onClick={() => handleSelectFile('direct')}
            >
              <PlusOutlined />
              <span className="text-sm">直传</span>
            </div>
          )}
        </div>
      </div>
      <CropImageModal {...cropModalProps} onCrop={res => startUpload(res.file)} aspectRatio={aspectRatio} />
    </>
  )
}
