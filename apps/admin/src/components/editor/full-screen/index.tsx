import { useImperativeHandle, useRef, useState, type ReactNode } from 'react'
import { LuArrowLeft, LuArrowRight } from 'react-icons/lu'

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

type FullScreenEditorProps = EditorProps & {
  leftToolExtra?: ReactNode
  rightToolExtra?: ReactNode
}

const previewClassMap = {
  1: {
    w: 'w-1/3',
    mw: 'max-w-screen-sm'
  },
  2: {
    w: 'w-2/3',
    mw: 'max-w-screen-lg'
  },
  3: {
    w: 'w-full',
    mw: 'max-w-screen-2xl'
  }
}

type PreviewKeys = keyof typeof previewClassMap

export const FullScreenEditor = ({
  ref,
  className,
  defaultValue,
  onChange,
  placeholder = '请输入内容',
  associatedFiles,
  emitter,
  leftToolExtra,
  rightToolExtra
}: FullScreenEditorProps) => {
  const { colorBgContainer } = useThemeToken()
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

  const [previewSize, setPreviewSize] = useState(3)
  const directionRef = useRef(true)
  const togglePreviewSize = () => {
    setPreviewSize(prevSize => {
      let newSize = 1
      if (directionRef.current) {
        newSize = prevSize - 1
      } else {
        newSize = prevSize + 1
      }
      if (newSize === 3) directionRef.current = true
      if (newSize === 1) directionRef.current = false
      return newSize
    })
  }
  return (
    <EditorRootContext.Provider value={{ editor, emitter: emitter ?? editorEmitter, associatedFiles }}>
      <div className={cn('h-full flex justify-center gap-2', className)}>
        <div className="w-33 shrink-0 flex flex-col gap-2">
          <MenuBar />
          {leftToolExtra}
        </div>
        <EditorContent
          editor={editor}
          data-empty={dataEmpty}
          data-placeholder={placeholder}
          className={cn(
            'w-full shadow-xs rounded-md p-3 overflow-y-auto text-base',
            'data-[empty=true]:before:content-[attr(data-placeholder)] data-[empty=true]:before:ml-1 data-[empty=true]:before:pointer-events-none data-[empty=true]:before:float-left data-[empty=true]:before:h-0',
            previewClassMap[previewSize as PreviewKeys].mw
          )}
          style={{
            transition: 'max-width 300ms 0ms',
            background: colorBgContainer
          }}
        />
        <div className="w-33 shrink-0 flex flex-col gap-2">
          <div
            className="rounded-md shadow-xs p-2 flex flex-col items-center gap-1"
            style={{ background: colorBgContainer }}
          >
            <div>预览窗口大小</div>
            <div
              className={cn(
                'flex items-center justify-between w-full h-7 cursor-pointer',
                previewClassMap[previewSize as PreviewKeys].w
              )}
              style={{
                transition: 'width 300ms 0ms'
              }}
              onClick={togglePreviewSize}
            >
              <LuArrowLeft />
              <div className="flex grow border-b border-dashed" />
              <LuArrowRight />
            </div>
          </div>
          {rightToolExtra}
        </div>
      </div>
    </EditorRootContext.Provider>
  )
}
