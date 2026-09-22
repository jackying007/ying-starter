import type { hc } from 'hono/client'
import type { client } from '@/business/client'

export type HCClient = ReturnType<typeof hc<typeof client>>
