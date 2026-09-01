import { useState } from 'react'
import { FaImage } from 'react-icons/fa'

import type { FileEntity } from '@ying/entity'
import { useEditorContext, MenuButton } from '@ying/frontend/editor'

import { ImageSelectorModal } from '@/components/image/image-selector-modal'

export const MenuImage = () => {
  const [open, setOpen] = useState(false)
  const { editor, emitter } = useEditorContext()
  const onSelectFiles = (files: FileEntity[]) => {
    if (!files.length) return
    emitter?.emit('add-associated-files', files)
    editor
      .chain()
      .focus()
      .insertContent({
        type: 'lazyImage',
        attrs: {
          id: files[0].id
        }
      })
      .run()
  }

  const selectImage = () => {
    setOpen(true)
  }

  return (
    <>
      <MenuButton onClick={selectImage}>
        <FaImage />
      </MenuButton>
      <ImageSelectorModal open={open} onSelect={onSelectFiles} onCancel={() => setOpen(false)} />
    </>
  )
}
