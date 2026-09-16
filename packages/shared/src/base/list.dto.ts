import { z } from 'zod'

export const listDto = z.object({
  page: z.coerce.number().positive().optional(),
  size: z.coerce.number().positive().optional(),
  date: z.array(z.string()).optional()
})
export type ListDto = z.infer<typeof listDto>
