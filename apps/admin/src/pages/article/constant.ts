import { BasicStatus } from '@ying/shared'
import { CreateArticleDto } from '@ying/shared/dto'

export const defaultValues: Partial<CreateArticleDto> = {
  name: undefined,
  title: undefined,
  keywords: undefined,
  coverId: undefined,
  status: BasicStatus.ENABLE
}
