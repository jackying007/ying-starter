import type { hc } from 'hono/client'
import type { admin } from '@/business/admin'

export type HCAdmin = ReturnType<typeof hc<typeof admin>>
