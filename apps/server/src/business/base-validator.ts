import type { ValidationTargets } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { zValidator as zv } from '@hono/zod-validator'
import { z, type ZodType } from 'zod'

export const zValidator = <T extends ZodType, Target extends keyof ValidationTargets>(target: Target, schema: T) =>
  zv(target, schema, result => {
    if (!result.success) {
      throw new HTTPException(400, {
        message: 'Validation Error',
        cause: result.error
      })
    }
  })

export const paramId = zValidator('param', z.object({ id: z.coerce.number() }))
