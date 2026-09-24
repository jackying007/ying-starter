import { App, Button, Modal, QRCode } from 'antd'

import { useDialogOpen } from '@ying/shared-react/hooks'
import { copyText, doDownload } from '@ying/shared-web'

export type TPromotionData = {
  title?: string
  link: string
}

type PromotionModalProps = ReturnType<typeof useDialogOpen<TPromotionData>>

export const PromotionModal = ({ formValue, open, onClose }: PromotionModalProps) => {
  const { message } = App.useApp()

  if (!formValue) return null

  return (
    <Modal title={formValue.title} open={open} footer={null} onCancel={onClose}>
      <div className="flex items-center justify-center gap-4 py-4">
        <QRCode id="QRCode" value={formValue.link} size={200} />
        <div className="flex flex-col gap-4">
          <Button
            type="dashed"
            onClick={() => {
              const canvas = document.getElementById('QRCode')?.querySelector<HTMLCanvasElement>('canvas')
              if (canvas) {
                const url = canvas.toDataURL()
                doDownload(url, 'QRCode.png')
              }
            }}
          >
            下载二维码
          </Button>
          <Button
            type="default"
            onClick={async () => {
              await copyText(formValue.link)
              message.success('复制成功')
            }}
          >
            复制链接
          </Button>
          <Button type="primary" onClick={() => window.open(formValue.link)}>
            预览链接
          </Button>
        </div>
      </div>
    </Modal>
  )
}
