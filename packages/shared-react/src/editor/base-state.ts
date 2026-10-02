import type { Editor, EditorStateSnapshot } from '@tiptap/react'

/**
 * State selector for the MenuBar component.
 * Extracts the relevant editor state for rendering menu buttons.
 */
export function editorBaseStateSelector(ctx: EditorStateSnapshot<Editor>) {
  return {
    // Text formatting
    isBold: ctx.editor.isActive('bold') ?? false,
    canBold: ctx.editor.can().chain().toggleBold().run() ?? false,
    isItalic: ctx.editor.isActive('italic') ?? false,
    canItalic: ctx.editor.can().chain().toggleItalic().run() ?? false,
    isStrike: ctx.editor.isActive('strike') ?? false,
    canStrike: ctx.editor.can().chain().toggleStrike().run() ?? false,

    // Lists
    isBulletList: ctx.editor.isActive('bulletList') ?? false,
    canBulletList: ctx.editor.can().chain().toggleBulletList().run() ?? false,
    isOrderedList: ctx.editor.isActive('orderedList') ?? false,
    canOrderedList: ctx.editor.can().chain().toggleOrderedList().run() ?? false,

    // blocks
    isCodeBlock: ctx.editor.isActive('codeBlock') ?? false,
    canCodeBlock: ctx.editor.can().chain().toggleCodeBlock().run() ?? false,
    isBlockquote: ctx.editor.isActive('blockquote') ?? false,
    canBlockquote: ctx.editor.can().chain().toggleBlockquote().run() ?? false,

    // Text alignment
    isAlignLeft: ctx.editor.isActive({ textAlign: 'left' }) ?? false,
    isAlignCenter: ctx.editor.isActive({ textAlign: 'center' }) ?? false,
    isAlignRight: ctx.editor.isActive({ textAlign: 'right' }) ?? false,
    canTextAlign: ctx.editor.can().chain().setTextAlign('center').run() ?? false,

    // History
    canUndo: ctx.editor.can().chain().undo().run() ?? false,
    canRedo: ctx.editor.can().chain().redo().run() ?? false
  }
}
