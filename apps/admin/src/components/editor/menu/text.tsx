import { Select } from 'antd'

import { useEditorContext, useEditorState } from '@ying/shared-react/editor'
import type { PropsWithClassName } from '@/types'

const TextOptions = [
  { label: 'H1', value: 'h1' },
  { label: 'H2', value: 'h2' },
  { label: 'H3', value: 'h3' },
  { label: 'H4', value: 'h4' },
  { label: 'H5', value: 'h5' },
  { label: 'H6', value: 'h6' },
  { label: 'P', value: 'p' },
  { label: '-', value: '-' }
]

export const MenuText = ({ className }: PropsWithClassName) => {
  const { editor } = useEditorContext()
  const state = useEditorState({
    editor,
    selector: ctx => ({
      isParagraph: ctx.editor.isActive('paragraph') ?? false,
      isHeading1: ctx.editor.isActive('heading', { level: 1 }) ?? false,
      isHeading2: ctx.editor.isActive('heading', { level: 2 }) ?? false,
      isHeading3: ctx.editor.isActive('heading', { level: 3 }) ?? false,
      isHeading4: ctx.editor.isActive('heading', { level: 4 }) ?? false,
      isHeading5: ctx.editor.isActive('heading', { level: 5 }) ?? false,
      isHeading6: ctx.editor.isActive('heading', { level: 6 }) ?? false
    })
  })

  function calcActiveText() {
    if (state.isParagraph) return 'p'
    if (state.isHeading1) return 'h1'
    if (state.isHeading2) return 'h2'
    if (state.isHeading3) return 'h3'
    if (state.isHeading4) return 'h4'
    if (state.isHeading5) return 'h5'
    if (state.isHeading6) return 'h6'
    return '-'
  }

  const activeText = calcActiveText()

  const selectText = (value: string) => {
    const chain = editor.chain().focus()
    let level: 1 | 2 | 3 | 4 | 5 | 6 = 1
    switch (value) {
      case 'p':
        chain.setParagraph().run()
        return
      case 'h1':
        level = 1
        break
      case 'h2':
        level = 2
        break
      case 'h3':
        level = 3
        break
      case 'h4':
        level = 4
        break
      case 'h5':
        level = 5
        break
      case 'h6':
        level = 6
        break
    }
    chain.setHeading({ level }).run()
  }

  return (
    <Select
      className={className}
      options={TextOptions}
      value={activeText}
      onChange={selectText}
      disabled={activeText === '-'}
    />
  )
}
