import { useState } from 'react'

import type { TFileExtra } from '@ying/shared'

export enum SelectFileType {
  Image,
  Video
}

export const selectFile: (type?: SelectFileType) => Promise<File> = type => {
  return new Promise(resolve => {
    const input = document.createElement('input')
    input.type = 'file'

    if (type === SelectFileType.Image) {
      input.accept = 'image/*'
    } else if (type === SelectFileType.Video) {
      input.accept = 'video/*'
    }

    input.multiple = false

    input.onchange = async () => {
      const file = input.files?.[0]
      if (file) {
        resolve(file)
      }
    }

    input.click()
  })
}

export const getFileInfo = async (file: File) => {
  if (file.type.includes('image')) {
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.src = URL.createObjectURL(file)
    await new Promise(resolve => (image.onload = resolve))
    const { width, height } = image

    return {
      size: file.size,
      type: file.type,
      width,
      height
    }
  } else {
    return {
      size: file.size,
      type: file.type
    }
  }
}

export type UseUploadOptions<T> = {
  handleUpload: (file: File, fileInfo: TFileExtra) => Promise<T>
  onSuccess?: (res: T) => void
  onError?: (error: Error) => void
}

export const useUpload = <T>({ handleUpload, onSuccess, onError }: UseUploadOptions<T>) => {
  const [loading, setLoading] = useState(false)

  const start = (type?: SelectFileType) => {
    selectFile(type).then(async file => {
      try {
        setLoading(true)
        const res = await handleUpload(file, await getFileInfo(file))
        onSuccess?.(res)
      } catch (error: unknown) {
        onError && onError(error as Error)
      } finally {
        setLoading(false)
      }
    })
  }

  const startUpload = async (file: File) => {
    try {
      setLoading(true)
      const res = await handleUpload(file, await getFileInfo(file))
      onSuccess && onSuccess(res)
    } catch (error: unknown) {
      onError && onError(error as Error)
    } finally {
      setLoading(false)
    }
  }

  return {
    start,
    startUpload,
    loading
  }
}
