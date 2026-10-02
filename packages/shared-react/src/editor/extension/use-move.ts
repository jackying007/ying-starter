import type { ReactNodeViewProps } from '@tiptap/react'

export const useMove = (props: ReactNodeViewProps) => {
  const { editor, getPos } = props

  const moveUp = () => {
    const pos = getPos()
    if (typeof pos !== 'number') return
    editor
      .chain()
      .command(({ tr }) => {
        const node = tr.doc.nodeAt(pos)
        if (!node) return false
        const before = tr.doc.resolve(pos).nodeBefore
        if (!before) return false
        const beforePos = pos - before.nodeSize
        tr.replaceWith(beforePos, pos + node.nodeSize, [node, before])
        return true
      })
      .run()
  }

  const moveDown = () => {
    const pos = props.getPos()
    if (typeof pos !== 'number') return
    editor
      .chain()
      .command(({ tr }) => {
        const node = tr.doc.nodeAt(pos)
        if (!node) return false
        const after = tr.doc.resolve(pos + node.nodeSize).nodeAfter
        if (!after) return false
        tr.replaceWith(pos, pos + node.nodeSize + after.nodeSize, [after, node])
        return true
      })
      .run()
  }

  return {
    moveUp,
    moveDown
  }
}
