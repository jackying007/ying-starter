import mitt from 'mitt'
import type { FileEntity } from '@ying/shared/entity'

export type Events = {
  'add-associated-files': FileEntity[]
  'edit-lazy-image-list': FileEntity[]
}

export const editorEmitter = mitt<Events>()

export type TEditorEmitter = typeof editorEmitter
