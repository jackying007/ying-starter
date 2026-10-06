import { useEffect } from 'react'
import {
  type EditorRootContextValue,
  EditorRootContext,
  EditorContent,
  defaultExtensions,
  useEditor
} from '@ying/shared-react/editor'

type RichContentProps = Pick<EditorRootContextValue, 'associatedFiles'> & {
  htmlText?: string
  onReady?: () => void
}

export const RichContent = ({ htmlText, associatedFiles, onReady }: RichContentProps) => {
  const editor = useEditor({
    extensions: defaultExtensions,
    editable: false
  })

  useEffect(() => {
    if (!htmlText || !editor) return
    editor.commands.setContent(htmlText)
    onReady?.()
  }, [htmlText, editor, onReady])

  return (
    <EditorRootContext.Provider value={{ editor, associatedFiles }}>
      <EditorContent editor={editor} />
    </EditorRootContext.Provider>
  )
}
