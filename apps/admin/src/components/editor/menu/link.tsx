import { LuLink } from 'react-icons/lu'
import { useEditorContext, useEditorState, MenuButton } from '@ying/shared-react/editor'
import { usePrompt } from '@/hooks'

export const MenuLink = () => {
  const { editor } = useEditorContext()
  const { selectionEmpty } = useEditorState({
    editor,
    selector: ctx => {
      const { from, to } = ctx.editor.state.selection
      const text = ctx.editor.state.doc.textBetween(from, to)
      return {
        selectionEmpty: !text
      }
    }
  })

  const prompt = usePrompt()

  const addLink = async () => {
    const value = editor.getAttributes('link').href
    const href = await prompt({
      title: '设置链接',
      placeholder: '请输入链接',
      defaultValue: value,
      registerOptions: {
        required: '请输入链接'
      }
    })
    if (!href) return
    editor.chain().focus().setLink({ href }).run()
  }

  return (
    <MenuButton disabled={selectionEmpty} onClick={addLink}>
      <LuLink />
    </MenuButton>
  )
}
