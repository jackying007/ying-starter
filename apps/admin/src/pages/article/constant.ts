import { BasicStatus } from '@ying/shared'
import type { CreateOrUpdateArticleDto } from '@ying/shared'

export const defaultValues: Partial<CreateOrUpdateArticleDto> = {
  name: undefined,
  title: undefined,
  keywords: undefined,
  coverId: undefined,
  status: BasicStatus.ENABLE
}
