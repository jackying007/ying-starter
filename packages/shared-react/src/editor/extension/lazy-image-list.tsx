import { useState, useEffect } from 'react'
import { NodeViewWrapper, type ReactNodeViewProps, Node, ReactNodeViewRenderer, mergeAttributes } from '@tiptap/react'
import { Grip, ArrowUp, ArrowDown, Edit } from 'lucide-react'
import { cn, Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '../../ui'
import { LazyImage } from '../../components'
import { useEditorContext } from '../provider'
import { MenuButton } from '../menu-button'
import { useSelected } from './use-selected'
import { useMove } from './use-move'

export const LazyImageListExtension = Node.create({
  name: 'lazyImageList',
  group: 'block',
  atom: true,
  draggable: true,
  selectable: true,
  addAttributes() {
    return {
      ids: {
        default: [],
        parseHTML: element => {
          const data = element.getAttribute('ids')
          try {
            return data ? JSON.parse(data) : []
          } catch {
            return []
          }
        },
        renderHTML: attributes => {
          if (!attributes.ids || attributes.ids.length === 0) return {}
          return {
            ids: JSON.stringify(attributes.ids)
          }
        }
      }
    }
  },

  parseHTML() {
    return [
      {
        tag: 'lazy-image-list'
      }
    ]
  },
  renderHTML({ HTMLAttributes }) {
    return ['lazy-image-list', mergeAttributes(HTMLAttributes)]
  },
  addNodeView() {
    return ReactNodeViewRenderer(LazyImageListCom)
  }
})

export type LazyImageListAttr = {
  ids: number[]
}
export const LazyImageListCom = (props: ReactNodeViewProps) => {
  const selected = useSelected(props)
  const { moveUp, moveDown } = useMove(props)
  const { ids } = props.node.attrs as LazyImageListAttr
  const { emitter, associatedFiles } = useEditorContext()
  // 按照 ids 的顺序获取出数据
  const imageFiles = ids.map(id => associatedFiles?.find(el => el.id === id)).filter(el => !!el)

  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  useEffect(() => {
    if (!api) return
    setCurrent(api.selectedScrollSnap() + 1)
    function onSelect() {
      if (!api) return
      setCurrent(api.selectedScrollSnap() + 1)
    }
    api.on('select', onSelect)
    return () => {
      api.off('select', onSelect)
    }
  }, [api])

  const edit = () => {
    if (!imageFiles || !emitter) return
    emitter.emit('edit-lazy-image-list', imageFiles)
  }

  return (
    <NodeViewWrapper>
      <div
        className={cn('my-1 relative outline-2 outline-transparent transition-colors', selected && 'outline-primary')}
      >
        <div className="mb-2 text-center text-sm text-muted-foreground">
          {current} / {imageFiles?.length ?? 0}
        </div>
        <Carousel key={JSON.stringify(ids)} className="group" setApi={setApi}>
          <CarouselContent>
            {imageFiles?.map(el => (
              <CarouselItem key={el.id}>
                <LazyImage
                  classNames={{
                    wrap: 'text-center min-h-60',
                    img: 'inline w-auto h-auto'
                  }}
                  src={el.url}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2 opacity-0 disabled:opacity-0 group-hover:disabled:opacity-50 group-hover:opacity-100" />
          <CarouselNext className="right-2 opacity-0 disabled:opacity-0 group-hover:disabled:opacity-50 group-hover:opacity-100" />
        </Carousel>
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
            <MenuButton className="absolute top-10 right-1" onClick={edit}>
              <Edit />
            </MenuButton>
          </>
        )}
      </div>
    </NodeViewWrapper>
  )
}
