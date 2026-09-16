import { z } from 'zod'

export const configDto = z.object({
  debugUserIds: z.string()
})

export type ConfigDto = z.infer<typeof configDto>
