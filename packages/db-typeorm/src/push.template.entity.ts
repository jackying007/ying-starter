import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import type { TIntlText, PushActionDto } from '@ying/shared'
import { BaseEntityWithAutoId, FileEntity } from '.'

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
  imageId?: number | null

  @ManyToOne(() => FileEntity)
  @JoinColumn()
  image?: FileEntity

  @Column({
    type: 'simple-json',
    nullable: true
  })
  actions?: PushActionDto[]
}
