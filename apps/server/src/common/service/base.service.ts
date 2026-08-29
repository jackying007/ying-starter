import type {
  DeepPartial,
  FindOptionsWhere,
  FindOptionsWhereProperty,
  FindOptionsSelectByString,
  QueryDeepPartialEntity
} from 'typeorm'
import { Between, Repository, SelectQueryBuilder, ObjectId } from 'typeorm'
import { ListDto } from '@ying/dto'
import { AbstractBaseEntity } from '@ying/entity'

export class BaseService<TEntity extends AbstractBaseEntity> {
  constructor(readonly repository: Repository<TEntity>) {}

  buildSkipAndTake(dto: ListDto) {
    const { page, size } = dto
    const skip = ((page || 1) - 1) * (size || 10)
    const take = size || 10

    return {
      skip,
      take
    }
  }

  buildListQuery(dto: ListDto) {
    const { date } = dto

    const where: FindOptionsWhere<TEntity> = {}
    if (date) {
      const startDate = new Date(date[0])
      const endDate = new Date(date[1])
      where.createAt = Between(startDate, endDate) as FindOptionsWhereProperty<
        NonNullable<TEntity['createAt']>,
        NonNullable<TEntity['createAt']>
      >
    }

    return {
      ...this.buildSkipAndTake(dto),
      where
    }
  }

  qbPostProcess(qb: SelectQueryBuilder<TEntity>, dto: ListDto) {
    const { skip, take } = this.buildSkipAndTake(dto)
    qb.take(take).skip(skip)
  }

  findOneBy(where: FindOptionsWhere<TEntity>) {
    return this.repository.findOneBy(where)
  }

  create(dto: DeepPartial<TEntity>) {
    return this.repository.save(this.repository.create(dto))
  }

  updateById(id: number, dto: QueryDeepPartialEntity<TEntity>) {
    return this.repository.update(id, dto)
  }

  excludeColumns(columnsToExclude: FindOptionsSelectByString<TEntity>) {
    return this.repository.metadata.columns
      .map(column => column.propertyName as keyof TEntity)
      .filter(columnName => !columnsToExclude.includes(columnName))
  }

  delete(
    criteria:
      | string
      | string[]
      | number
      | number[]
      | Date
      | Date[]
      | ObjectId
      | ObjectId[]
      | FindOptionsWhere<TEntity>
      | FindOptionsWhere<TEntity>[]
  ) {
    return this.repository.delete(criteria)
  }

  softDelete(
    criteria:
      | string
      | string[]
      | number
      | number[]
      | Date
      | Date[]
      | ObjectId
      | ObjectId[]
      | FindOptionsWhere<TEntity>
      | FindOptionsWhere<TEntity>[]
  ) {
    return this.repository.softDelete(criteria)
  }
}
