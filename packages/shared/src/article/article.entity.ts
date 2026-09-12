import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from 'typeorm'
import { BasicStatus, BaseEntityWithAutoId, type TIntlText } from '../base'
import { FileEntity } from '../file'

@Entity({ name: 'article' })
export class ArticleEntity extends BaseEntityWithAutoId {
  @Column()
  name: string

  @Column({
    type: 'json'
  })
  title: TIntlText

  @Column({
    nullable: true,
    type: 'simple-array'
  })
  keywords?: string[]

  @Column({
    type: 'json',
    nullable: true
  })
  content?: TIntlText

  @Column()
  coverId: number

  @ManyToOne(() => FileEntity)
  @JoinColumn()
  cover: FileEntity

  @Column({
    type: 'smallint',
    default: BasicStatus.ENABLE
  })
  status: BasicStatus

  @Column({
    default: 0
  })
  sort: number

  @Column({
    default: 0
  })
  view: number

  @ManyToMany(() => FileEntity)
  @JoinTable({
    name: 'article_associated_file',
    joinColumn: {
      name: 'articleId',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'fileId',
      referencedColumnName: 'id'
    }
  })
  associatedFiles?: FileEntity[]
}
