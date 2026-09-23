import { Like } from 'typeorm'
import type { ListArticleDto, UpdateArticleContentDto } from '@ying/shared'
import { ArticleEntity, FileEntity } from '@ying/db-typeorm'
import { dataSource } from '@/common/modules/db'
import { BaseService } from '@/common/service/base.service'

export class ArticleService extends BaseService<ArticleEntity> {
  constructor() {
    super(dataSource.getRepository(ArticleEntity))
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

    return this.repository.find({
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
    return this.repository.countBy(where)
  }

  async detail(id: number) {
    const article = await this.repository.findOne({
      where: { id },
      relations: {
        cover: true,
        associatedFiles: true
      }
    })
    if (!article) throw new Error('article is not exist')
    return article
  }

  async view(id: number) {
    await this.repository.increment({ id }, 'view', 1)
  }

  async updateContent(dto: UpdateArticleContentDto) {
    const article = await this.repository.findOneBy({ id: dto.id })
    if (!article) throw new Error('article is not exist')

    article.content = dto.content
    article.associatedFiles = dto.associatedFileIds?.map(id => {
      const file = new FileEntity()
      file.id = id
      return file
    })

    return this.repository.save(article)
  }
}
