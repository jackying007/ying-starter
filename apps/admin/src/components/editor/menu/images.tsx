import { useEffect, useState } from 'react'
import { FaImages } from 'react-icons/fa'
import { Modal } from 'antd'

import type { FileEntity } from '@ying/shared/entity'
import { useDialogOpen, useRemount } from '@ying/frontend/hooks'
import { useEditorContext, MenuButton, type Events } from '@ying/frontend/editor'

import { ImageSelector } from '@/components/image'

export const MenuImages = () => {
  const imageWallModalProps = useDialogOpen()

  const openImageWall = () => {
    imageWallModalProps.onOpen()
  }

  return (
    <>
      <MenuButton onClick={openImageWall}>
        <FaImages />
      </MenuButton>
      <ImageWallModal {...imageWallModalProps} />
    </>
  )
}

type ImageWallModalProps = ReturnType<typeof useDialogOpen>
const ImageWallModal = ({ open, onOpen, onClose }: ImageWallModalProps) => {
  const [images, setImages] = useState<FileEntity[]>()
  const { editor, emitter } = useEditorContext()

  const onOk = () => {
    if (!images) return
    emitter?.emit('add-associated-files', images)
    editor
      .chain()
      .focus()
      .insertContent({
        type: 'lazyImageList',
        attrs: {
          ids: images.map(el => el.id)
        }
      })
      .run()
    onClose()
  }

  useEffect(() => {
    const onEdit = (imageFiles: Events['edit-lazy-image-list']) => {
      setImages(imageFiles)
      onOpen()
    }
    emitter?.on('edit-lazy-image-list', onEdit)
    return () => {
      emitter?.off('edit-lazy-image-list', onEdit)
    }
  }, [emitter, onOpen])

  const { renderKey } = useRemount(open)

  return (
    <Modal
      title="添加图片集"
      width="820px"
      open={open}
      onCancel={onClose}
      okButtonProps={{ disabled: !images?.length }}
      onOk={onOk}
    >
      <ImageSelector key={renderKey} defaultValue={images} onChange={setImages} maxLength={5} />
    </Modal>
  )
}
