import type { Ref } from 'react'
import type { TEditorEmitter } from '@ying/frontend/editor'
import type { FileVo } from '@ying/server/types-admin'

export type EditorHandle = {
  setContent: (val: string) => void
}

export type EditorProps = {
  ref?: Ref<EditorHandle>
  className?: string
  placeholder?: string
  defaultValue?: string
  onChange?: (text: string) => void
  associatedFiles?: FileVo[]
  emitter?: TEditorEmitter
}
