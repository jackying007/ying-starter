import { useRef, useState } from 'react'
import { Image } from 'antd'
import { EyeFilled, DeleteOutlined, PlusOutlined, DragOutlined } from '@ant-design/icons'
import { DndContext, type DragEndEvent } from '@dnd-kit/core'
import { SortableContext, rectSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { FileEntity } from '@ying/entity'
import { ImageSelectorModal, type ImageSelectorModalRefHandle } from './image-selector-modal'

type ImageSelectorProps = {
  maxLength?: number
  defaultValue?: FileEntity[] | FileEntity
  onChange?: (files: FileEntity[]) => void
}

export const ImageSelector = ({ maxLength = 5, defaultValue, onChange }: ImageSelectorProps) => {
  const [open, setOpen] = useState(false)
  const [images, setImages] = useState(
    defaultValue ? (Array.isArray(defaultValue) ? defaultValue : [defaultValue]) : []
  )

  const imageSelectorModalRef = useRef<ImageSelectorModalRefHandle>(null)

  const onSelect = (files: FileEntity[]) => {
    setImages(files)
    onChange?.(files)
  }

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over) return
    if (active.id !== over.id) {
      const oldIndex = images.findIndex(el => el.id === active.id)
      const newIndex = images.findIndex(el => el.id === over.id)
      const newItems = arrayMove(images, oldIndex, newIndex)
      setImages(newItems)
      onChange?.(newItems)
    }
  }

  const [previewUrl, setPreviewUrl] = useState('')
  const onPreview = (file: FileEntity) => {
    setPreviewUrl(file.url)
  }
  const onDelete = (file: FileEntity) => {
    const newImages = images.filter(el => el.id !== file.id)
    setImages(newImages)
    onChange?.(newImages)
    imageSelectorModalRef.current?.setSelectedFiles(newImages)
  }

  return (
    <DndContext onDragEnd={onDragEnd}>
      <SortableContext items={images} strategy={rectSortingStrategy}>
        <div className="flex flex-wrap gap-4">
          {images.map(item => (
            <SortableImageItem key={item.id} item={item} onPreview={onPreview} onDelete={onDelete} />
          ))}
          {images.length < maxLength && (
            <div
              className="w-27.5 h-27.5 cursor-pointer overflow-hidden rounded-md shadow-xs border border-border text-2xl fc bg-hover text-gray"
              onClick={() => setOpen(true)}
            >
              <PlusOutlined />
            </div>
          )}
          <ImageSelectorModal
            defaultFiles={images}
            open={open}
            onCancel={() => setOpen(false)}
            onSelect={onSelect}
            maxLength={maxLength}
            ref={imageSelectorModalRef}
          />
          {previewUrl && (
            <Image
              style={{ display: 'none' }}
              src={previewUrl}
              preview={{
                open: !!previewUrl,
                onOpenChange: value => {
                  if (!value) setPreviewUrl('')
                }
              }}
            />
          )}
        </div>
      </SortableContext>
    </DndContext>
  )
}

type SortableImageItemProps = {
  item: FileEntity
  onPreview: (item: FileEntity) => void
  onDelete: (item: FileEntity) => void
}
const SortableImageItem = ({ item, onPreview, onDelete }: SortableImageItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id })
  const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 99 : 'auto' }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="inline-block w-27.5 h-27.5 overflow-hidden rounded-md shadow-xs border border-border"
    >
      <div className="w-full h-full fc bg-hover relative">
        <Image src={item.url} />
        <div className="w-full h-full absolute left-0 top-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity text-white/90">
          <EyeFilled
            className="text-base absolute right-2 top-2 rounded-md p-1 bg-white/40 hover:bg-white/60"
            onClick={() => onPreview(item)}
          />
          <DeleteOutlined
            className="text-base absolute right-10 top-2 rounded-md p-1 bg-white/40 hover:bg-white/60"
            onClick={() => onDelete(item)}
          />
          <DragOutlined
            className="text-xl absolute left-[50%] top-[50%] translate-x-[-50%] rounded-md p-1 bg-white/40 hover:bg-white/60"
            {...attributes}
            {...listeners}
          />
        </div>
      </div>
    </div>
  )
}
