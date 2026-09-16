import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Like, Repository } from 'typeorm'

import type { CreateOrUpdateArticleDto, ListArticleDto, UpdateArticleContentDto } from '@ying/shared'
import { ArticleEntity, FileEntity } from '@ying/shared'

import { BaseService } from '@/common/service/base.service'

@Injectable()
export class ArticleService extends BaseService<ArticleEntity> {
  constructor(
    @InjectRepository(ArticleEntity)
    readonly articleRepository: Repository<ArticleEntity>
  ) {
    super(articleRepository)
  }

  buildListQuery(dto: ListArticleDto) {
    const listQuery = super.buildListQuery(dto)
    const { name, status } = dto
    Object.assign(listQuery.where, {
      name: name ? Like(`%${name}%`) : undefined,
      status
    })
    return listQuery
  }

  list(dto: ListArticleDto) {
    const { where, skip, take } = this.buildListQuery(dto)

    return this.articleRepository.find({
      where,
      skip,
      take,
      select: this.excludeColumns(['content', 'associatedFiles']),
      order: {
        createAt: 'DESC'
      },
      relations: {
        cover: true
      }
    })
  }

  listCount(dto: ListArticleDto) {
    const { where } = this.buildListQuery(dto)
    return this.articleRepository.countBy(where)
  }

  detail(id: number) {
    return this.articleRepository.findOne({
      where: { id },
      relations: {
        cover: true,
        associatedFiles: true
      }
    })
  }

  async view(id: number) {
    await this.articleRepository.increment({ id }, 'view', 1)
  }

  createOrUpdate(dto: CreateOrUpdateArticleDto) {
    if (dto.id) {
      return this.updateById(dto.id, dto)
    } else {
      return this.create(dto)
    }
  }

  async updateContent(dto: UpdateArticleContentDto) {
    const article = await this.repository.findOneBy({ id: dto.id })
    if (!article) throw new InternalServerErrorException()

    article.content = dto.content
    article.associatedFiles = dto.associatedFileIds?.map(id => {
      const file = new FileEntity()
      file.id = id
      return file
    })

    await this.repository.save(article)
  }
}
