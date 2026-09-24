import { useImperativeHandle, useState } from 'react'

import {
  useEditor,
  EditorRootContext,
  EditorContent,
  defaultExtensions,
  editorEmitter
} from '@ying/shared-react/editor'
import { cn } from '@ying/shared-react/ui'

import { useThemeToken } from '@/hooks'

import type { EditorProps } from '../type'
import { MenuBar } from './menu-bar'

export const NormalEditor = ({
  ref,
  className,
  defaultValue,
  onChange,
  placeholder = '请输入内容',
  associatedFiles,
  emitter
}: EditorProps) => {
  const { colorBgLayout } = useThemeToken()
  const editor = useEditor({
    extensions: defaultExtensions,
    content: defaultValue,
    onUpdate: ({ editor }) => {
      setDataEmpty(editor.isEmpty)
      onChange?.(editor.getHTML())
    }
  })
  const [dataEmpty, setDataEmpty] = useState(editor.isEmpty)

  useImperativeHandle(ref, () => ({
    setContent: val => {
      editor.commands.setContent(val, { emitUpdate: false })
      setTimeout(() => {
        setDataEmpty(editor.isEmpty)
      })
    }
  }))

  return (
    <EditorRootContext.Provider value={{ editor, emitter: emitter ?? editorEmitter, associatedFiles }}>
      <div className={cn('border border-border rounded-md overflow-hidden relative', className)}>
        <MenuBar />
        <EditorContent
          editor={editor}
          data-empty={dataEmpty}
          data-placeholder={placeholder}
          className={cn(
            'h-140 p-3 overflow-y-auto',
            'data-[empty=true]:before:content-[attr(data-placeholder)] data-[empty=true]:before:ml-1 data-[empty=true]:before:pointer-events-none data-[empty=true]:before:float-left data-[empty=true]:before:h-0'
          )}
          style={{
            background: colorBgLayout
          }}
        />
      </div>
    </EditorRootContext.Provider>
  )
}
