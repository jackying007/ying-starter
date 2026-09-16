import { z } from 'zod'
import { listDto } from '../base'

export const createFeedbackDto = z.object({
  firstName: z.string().max(10).optional(),
  lastName: z.string().max(10).optional(),
  email: z.email('validation.incorrect_email_format').nonempty('validation.email_should_not_be_empty'),
  content: z.string().max(300).nonempty('validation.content_should_not_be_empty')
})

export type CreateFeedbackDto = z.infer<typeof createFeedbackDto>

export const listFeedbackDto = listDto.extend({
  email: z.string().optional()
})

export type ListFeedbackDto = z.infer<typeof listFeedbackDto>
