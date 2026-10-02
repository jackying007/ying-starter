import { CreateDateColumn, DeleteDateColumn, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { nanoid } from 'nanoid'

export abstract class AbstractBaseEntity {
  createAt: Date
  updateAt: Date
  deletedAt: Date
}

export class BaseEntityWithoutId extends AbstractBaseEntity {
  @CreateDateColumn({
    type: 'timestamp with time zone'
  })
  declare createAt: Date

  @UpdateDateColumn({
    type: 'timestamp with time zone'
  })
  declare updateAt: Date

  @DeleteDateColumn({
    type: 'timestamp with time zone'
  })
  declare deletedAt: Date
}

export class BaseEntityWithAutoId extends AbstractBaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @CreateDateColumn({
    type: 'timestamp with time zone'
  })
  declare createAt: Date

  @UpdateDateColumn({
    type: 'timestamp with time zone'
  })
  declare updateAt: Date

  @DeleteDateColumn({
    type: 'timestamp with time zone'
  })
  declare deletedAt: Date
}

export class BaseEntityWithNanoID extends AbstractBaseEntity {
  @PrimaryColumn('varchar', { length: 20 })
  id = nanoid(20)

  @CreateDateColumn({
    type: 'timestamp with time zone'
  })
  declare createAt: Date

  @UpdateDateColumn({
    type: 'timestamp with time zone'
  })
  declare updateAt: Date

  @DeleteDateColumn({
    type: 'timestamp with time zone'
  })
  declare deletedAt: Date
}
