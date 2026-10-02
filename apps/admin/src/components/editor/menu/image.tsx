import { useState } from 'react'
import { FaImage } from 'react-icons/fa'

import type { FileVo } from '@ying/server/types-admin'
import { useEditorContext, MenuButton } from '@ying/shared-react/editor'

import { ImageSelectorModal } from '@/components/image/image-selector-modal'

export const MenuImage = () => {
  const [open, setOpen] = useState(false)
  const { editor, emitter } = useEditorContext()
  const onSelectFiles = (files: FileVo[]) => {
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
