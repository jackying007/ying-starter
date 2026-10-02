import {
  LuBold,
  LuItalic,
  LuStrikethrough,
  LuListOrdered,
  LuList,
  LuBrackets,
  LuCode,
  LuUndo2,
  LuRedo2,
  LuAlignLeft,
  LuAlignCenter,
  LuAlignRight
} from 'react-icons/lu'

import { useEditorContext, useEditorState, editorBaseStateSelector, MenuButton } from '@ying/shared-react/editor'

import { MenuText, MenuTextColor, MenuBgColor, MenuLink, MenuImage, MenuImages } from '../menu'
import { useThemeToken } from '@/hooks'

export const MenuBar = () => {
  const { colorBgContainer } = useThemeToken()
  const { editor } = useEditorContext()
  const state = useEditorState({
    editor,
    selector: editorBaseStateSelector
  })

  return (
    <div className="flex flex-wrap gap-2 border-b border-border p-2" style={{ background: colorBgContainer }}>
      <MenuText className="w-16" />
      <MenuButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!state.canBold}
        active={state.isBold}
      >
        <LuBold />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!state.canItalic}
        active={state.isItalic}
      >
        <LuItalic />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!state.canStrike}
        active={state.isStrike}
      >
        <LuStrikethrough />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        disabled={!state.canBulletList}
        active={state.isBulletList}
      >
        <LuList />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        disabled={!state.canOrderedList}
        active={state.isOrderedList}
      >
        <LuListOrdered />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        disabled={!state.canCodeBlock}
        active={state.isCodeBlock}
      >
        <LuCode />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        disabled={!state.canBlockquote}
        active={state.isBlockquote}
      >
        <LuBrackets />
      </MenuButton>
      <MenuButton onClick={() => editor.chain().focus().setHorizontalRule().run()}>__</MenuButton>

      <MenuButton
        onClick={() => editor.chain().focus().toggleTextAlign('left').run()}
        disabled={!state.canTextAlign}
        active={state.isAlignLeft}
      >
        <LuAlignLeft />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().toggleTextAlign('center').run()}
        disabled={!state.canTextAlign}
        active={state.isAlignCenter}
      >
        <LuAlignCenter />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().toggleTextAlign('right').run()}
        disabled={!state.canTextAlign}
        active={state.isAlignRight}
      >
        <LuAlignRight />
      </MenuButton>

      <MenuTextColor />
      <MenuBgColor />
      <MenuLink />
      <MenuImage />
      <MenuImages />

      <MenuButton onClick={() => editor.chain().focus().undo().run()} disabled={!state.canUndo}>
        <LuUndo2 />
      </MenuButton>
      <MenuButton onClick={() => editor.chain().focus().redo().run()} disabled={!state.canRedo}>
        <LuRedo2 />
      </MenuButton>
    </div>
  )
}
