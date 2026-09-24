import type { ReactNodeViewProps } from '@tiptap/react'
import { useEffect, useState } from 'react'

export const useSelected = (props: ReactNodeViewProps) => {
  const { editor, getPos } = props
  const [selected, setSelected] = useState(false)
  useEffect(() => {
    if (!editor.isEditable) return
    const update = () => {
      const { selection } = editor.state
      const pos = getPos()
      setSelected(selection.from === pos)
    }
    editor.on('selectionUpdate', update)
    return () => {
      editor.off('selectionUpdate', update)
    }
  }, [])

  return selected
}
