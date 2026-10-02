import { NodeViewWrapper, type ReactNodeViewProps, Node, ReactNodeViewRenderer, mergeAttributes } from '@tiptap/react'
import { Grip, ArrowUp, ArrowDown } from 'lucide-react'
import { cn } from '../../ui'
import { LazyImage } from '../../components'
import { useEditorContext } from '../provider'
import { MenuButton } from '../menu-button'
import { useSelected } from './use-selected'
import { useMove } from './use-move'

export const LazyImageExtension = Node.create({
  name: 'lazyImage',
  group: 'block',
  atom: true,
  draggable: true,
  selectable: true,
  addAttributes() {
    return {
      id: {
        default: 0
      }
    }
  },
  parseHTML() {
    return [
      {
        tag: 'lazy-image'
      }
    ]
  },
  renderHTML({ HTMLAttributes }) {
    return ['lazy-image', mergeAttributes(HTMLAttributes)]
  },
  addNodeView() {
    return ReactNodeViewRenderer(LazyImageCom)
  }
})

export type LazyImageAttr = {
  id: number
}
export const LazyImageCom = (props: ReactNodeViewProps) => {
  const selected = useSelected(props)
  const { moveUp, moveDown } = useMove(props)
  const { id } = props.node.attrs as LazyImageAttr
  const { associatedFiles } = useEditorContext()
  const imageFile = associatedFiles?.find(el => el.id === id)

  if (!imageFile) return null
  return (
    <NodeViewWrapper>
      <div
        className={cn(
          'my-1 text-center relative outline-2 outline-transparent transition-colors',
          selected && 'outline-primary'
        )}
      >
        <LazyImage
          classNames={{
            wrap: 'text-center min-w-60 min-h-60 w-fit h-fit inline-block',
            img: 'inline w-auto h-auto'
          }}
          src={imageFile.url}
        />
        {selected && (
          <>
            <MenuButton data-drag-handle className="absolute cursor-grab top-1 right-1">
              <Grip />
            </MenuButton>
            <MenuButton className="absolute top-1 right-19" onClick={moveUp}>
              <ArrowUp />
            </MenuButton>
            <MenuButton className="absolute top-1 right-10" onClick={moveDown}>
              <ArrowDown />
            </MenuButton>
          </>
        )}
      </div>
    </NodeViewWrapper>
  )
}
