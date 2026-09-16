import z from 'zod'
import { BasicStatus, listDto, zIntlText } from '../base'

export const listArticleDto = listDto.extend({
  name: z.string().optional(),
  status: z.coerce.number().pipe(z.enum(BasicStatus)).optional()
})
export type ListArticleDto = z.infer<typeof listArticleDto>

export const createOrUpdateArticleDto = z.object({
  id: z.number().optional(),
  name: z.string().nonempty('名称不能为空'),
  title: zIntlText(),
  keywords: z.array(z.string()).optional(),
  coverId: z.number('封面不能为空'),
  sort: z.number().optional(),
  status: z.number().pipe(z.enum(BasicStatus))
})
export type CreateOrUpdateArticleDto = z.infer<typeof createOrUpdateArticleDto>

export const updateArticleContentDto = z.object({
  id: z.number(),
  content: zIntlText({ canEmpty: true }),
  associatedFileIds: z.array(z.number()).optional()
})
export type UpdateArticleContentDto = z.infer<typeof updateArticleContentDto>
