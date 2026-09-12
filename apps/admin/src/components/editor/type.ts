import type { Ref } from 'react'
import type { TEditorEmitter } from '@ying/frontend/editor'
import type { FileEntity } from '@ying/shared'

export type EditorHandle = {
  setContent: (val: string) => void
}

export type EditorProps = {
  ref?: Ref<EditorHandle>
  className?: string
  placeholder?: string
  defaultValue?: string
  onChange?: (text: string) => void
  associatedFiles?: FileEntity[]
  emitter?: TEditorEmitter
}
