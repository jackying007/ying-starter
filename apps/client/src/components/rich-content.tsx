import { useEffect } from 'react'
import { useMounted } from '@ying/frontend/hooks'
import {
  type EditorRootContextValue,
  EditorRootContext,
  EditorContent,
  defaultExtensions,
  useEditor
} from '@ying/frontend/editor'

type RichContentProps = Pick<EditorRootContextValue, 'associatedFiles'> & {
  htmlText?: string
}

export const RichContent = ({ htmlText, associatedFiles }: RichContentProps) => {
  const editor = useEditor({
    extensions: defaultExtensions,
    editable: false
  })

  useEffect(() => {
    if (htmlText && editor) setTimeout(() => editor.commands.setContent(htmlText))
  }, [htmlText, editor])

  const mounted = useMounted()

  if (mounted)
    return (
      <EditorRootContext.Provider value={{ editor, associatedFiles }}>
        <EditorContent editor={editor} />
      </EditorRootContext.Provider>
    )
  return <div dangerouslySetInnerHTML={{ __html: htmlText ?? '' }} />
}
