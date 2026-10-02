import { Modal } from 'antd'
import { JsonEditor } from 'json-edit-react'

import { useDialogOpen } from '@ying/shared-react/hooks'

type JsonViewModalProps = ReturnType<typeof useDialogOpen<object>>

export function JsonViewModal({ open, formValue, onClose }: JsonViewModalProps) {
  return (
    <Modal title="查看JSON内容" width={800} open={open} onCancel={onClose} footer={false}>
      <JsonEditor className="max-w-full!" collapse={false} viewOnly rootName="" data={formValue} rootFontSize={14} />
    </Modal>
  )
}
