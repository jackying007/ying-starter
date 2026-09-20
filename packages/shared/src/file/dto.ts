import z from 'zod'
import { listDto } from '../base'
import { FileSourceType, FileType } from './enum'

export const listFileDto = listDto.extend({
  type: z.enum(FileType).optional(),
  from: z.enum(FileSourceType).optional(),
  isExternal: z.stringbool().optional()
})

export type ListFileDto = z.infer<typeof listFileDto>
