import { EventEmitter } from '@ying/utils'
import type { FileVo } from '@ying/server/types-admin'

export type Events = {
  'add-associated-files': FileVo[]
  'edit-lazy-image-list': FileVo[]
}

export const editorEmitter = new EventEmitter<Events>()

export type TEditorEmitter = typeof editorEmitter
