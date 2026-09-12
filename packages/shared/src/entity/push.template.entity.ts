import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import type { TIntlText } from '../'
import { PushActionDto } from '../dto'
import { BaseEntityWithAutoId } from './base'
import { FileEntity } from './file.entity'

@Entity({ name: 'push_template' })
export class PushTemplateEntity extends BaseEntityWithAutoId {
  @Column()
  name: string

  @Column({
    type: 'json'
  })
  title: TIntlText

  @Column({
    nullable: true
  })
  link?: string

  @Column({
    type: 'json',
    nullable: true
  })
  body?: TIntlText

  @Column({
    nullable: true
  })
  imageId?: number

  @ManyToOne(() => FileEntity)
  @JoinColumn()
  image?: FileEntity

  @Column({
    type: 'simple-json',
    nullable: true
  })
  actions?: PushActionDto[]
}
