import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import {
  CreateArticleDto,
  UpdateArticleDto,
  ListArticleDto,
  DeleteDto,
  UpdateArticleContentDto
} from '@ying/shared/dto'
import { pms } from '@ying/shared/permission'
import { AdminScope, PermissionDecorator } from '@/common/decorator'
import { ArticleService } from '@/business/modules/article'

@PermissionDecorator(pms.article)
@AdminScope()
@Controller('admin/article')
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

  @PermissionDecorator(pms.article.create)
  @Post()
  create(@Body() dto: CreateArticleDto) {
    return this.articleService.create(dto)
  }

  @PermissionDecorator(pms.article.update)
  @Put()
  update(@Body() dto: UpdateArticleDto) {
    return this.articleService.updateById(dto.id, dto)
  }

  @PermissionDecorator(pms.article.updateContent)
  @Put('content')
  updateContent(@Body() dto: UpdateArticleContentDto) {
    return this.articleService.updateContent(dto)
  }

  @PermissionDecorator(pms.article.delete)
  @Delete()
  delete(@Body() dto: DeleteDto) {
    return this.articleService.delete(dto.ids)
  }
}
