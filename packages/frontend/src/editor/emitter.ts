import mitt from 'mitt'
import type { FileVo } from '@ying/server/types-admin'

export type Events = {
  'add-associated-files': FileVo[]
  'edit-lazy-image-list': FileVo[]
}

export const editorEmitter = mitt<Events>()

export type TEditorEmitter = typeof editorEmitter
