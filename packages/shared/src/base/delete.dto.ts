import { z } from 'zod'

export const deleteDto = z.object({
  ids: z.array(z.number()).nonoptional()
})

export type DeleteDto = z.infer<typeof deleteDto>
