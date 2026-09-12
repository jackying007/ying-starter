import { createContext, useContext } from 'react'
import { Editor } from '@tiptap/react'
import { FileEntity } from '@ying/shared'
import type { TEditorEmitter } from './emitter'

export type EditorRootContextValue = {
  editor: Editor
  emitter?: TEditorEmitter
  associatedFiles?: FileEntity[]
}

export const EditorRootContext = createContext<EditorRootContextValue | undefined>(undefined)

export const useEditorContext = () => {
  const context = useContext(EditorRootContext)
  if (!context) throw new Error('useEditorContext must be used within <EditorRootContext.Provider>')
  return context
}
