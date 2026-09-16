import { z } from 'zod'

export const statDto = z.object({
  type: z.enum(['hour', 'day']),
  date: z.array(z.string()).length(2).nonempty()
})

export type StatDto = z.infer<typeof statDto>
