import { Controller, Get, Param, Query } from '@nestjs/common'
import { ListArticleDto } from '@ying/shared/dto'
import { ClientScope, Public } from '@/common/decorator'
import { ArticleService } from '@/business/modules/article'

@Public()
@ClientScope()
@Controller('client/article')
export class ArticleController {
  constructor(readonly articleService: ArticleService) {}

  @Get('list')
  list(@Query() dto: ListArticleDto) {
    return this.articleService.list(dto)
  }

  @Get('list-count')
  listCount(@Query() dto: ListArticleDto) {
    return this.articleService.listCount(dto)
  }

  @Get(':id')
  detail(@Param('id') id: number) {
    return this.articleService.detail(id)
  }

  @Get(':id/view')
  view(@Param('id') id: number) {
    return this.articleService.view(id)
  }
}
