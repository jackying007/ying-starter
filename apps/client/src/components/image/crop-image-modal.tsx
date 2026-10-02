import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { useDialogOpen } from '@ying/shared-react/hooks'
import {
  Button,
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
  DialogFooter,
  DialogClose
} from '@ying/shared-react/ui'
import type { TCropImageHandle, TSaveRes } from '@ying/shared-react/components'
import { CropImage } from '@ying/shared-react/components'

type CropImageModalProps = ReturnType<typeof useDialogOpen<File>> & {
  onCrop?: (res: TSaveRes) => void
  aspectRatio?: number
}

export const CropImageModal = ({
  open,
  formValue: file,
  onOpenChange,
  onClose,
  aspectRatio,
  onCrop
}: CropImageModalProps) => {
  const { t } = useTranslation()
  const ref = useRef<TCropImageHandle>(null)
  const [loading, setLoading] = useState(false)

  const confirm = async () => {
    if (!ref.current) return
    try {
      setLoading(true)
      const res = await ref.current.save()
      if (res) {
        onCrop?.(res)
      }
      onClose()
    } catch {
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('crop_image')}</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        {file && (
          <CropImage
            ref={ref}
            url={URL.createObjectURL(file)}
            type={file.type}
            name={file.name}
            aspectRatio={aspectRatio}
          />
        )}
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline">{t('close')}</Button>
          </DialogClose>
          <Button variant="default" loading={loading} onClick={confirm}>
            {t('confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
