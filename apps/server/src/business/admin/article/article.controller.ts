import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { listArticleDto, createOrUpdateArticleDto, updateArticleContentDto, deleteDto } from '@ying/shared'
import type { ListArticleDto, CreateOrUpdateArticleDto, UpdateArticleContentDto, DeleteDto } from '@ying/shared'
import { pms } from '@ying/shared/permission'
import { AdminScope, PermissionDecorator } from '@/common/decorator'
import { ArticleService } from '@/business/modules/article'

@PermissionDecorator(pms.article)
@AdminScope()
@Controller('admin/article')
export class ArticleController {
  constructor(readonly articleService: ArticleService) {}

  @Get('list')
  list(@Query({ schema: listArticleDto }) dto: ListArticleDto) {
    return this.articleService.list(dto)
  }

  @Get('list-count')
  listCount(@Query({ schema: listArticleDto }) dto: ListArticleDto) {
    return this.articleService.listCount(dto)
  }

  @Get(':id')
  detail(@Param('id') id: number) {
    return this.articleService.detail(id)
  }

  @PermissionDecorator(pms.article.create)
  @Post()
  create(@Body({ schema: createOrUpdateArticleDto }) dto: CreateOrUpdateArticleDto) {
    return this.articleService.createOrUpdate(dto)
  }

  @PermissionDecorator(pms.article.update)
  @Put()
  update(@Body({ schema: createOrUpdateArticleDto }) dto: CreateOrUpdateArticleDto) {
    return this.articleService.createOrUpdate(dto)
  }

  @PermissionDecorator(pms.article.updateContent)
  @Put('content')
  updateContent(@Body({ schema: updateArticleContentDto }) dto: UpdateArticleContentDto) {
    return this.articleService.updateContent(dto)
  }

  @PermissionDecorator(pms.article.delete)
  @Delete()
  delete(@Body({ schema: deleteDto }) dto: DeleteDto) {
    return this.articleService.delete(dto.ids)
  }
}
