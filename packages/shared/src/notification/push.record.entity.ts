import { Column, Entity, ManyToOne } from 'typeorm'
import { BaseEntityWithAutoId } from '../base'
import { PushRecordStatus } from './enum'
import { PushTaskEntity } from './push.task.entity'

export type PushData = {
  title: string
  body?: string
  link?: string
  image?: string
  actions?: {
    title: string
    link?: string
  }[]
}

@Entity({ name: 'push_record' })
export class PushRecordEntity extends BaseEntityWithAutoId {
  @Column({
    type: 'simple-json'
  })
  pushData: PushData

  @Column({
    type: 'text',
    nullable: true
  })
  pushResult?: string

  @Column({
    type: 'smallint',
    default: 0
  })
  clicked: number

  @Column({
    type: 'smallint',
    default: PushRecordStatus.Pushing
  })
  status: PushRecordStatus

  @Column()
  pushTaskId: number

  @ManyToOne(() => PushTaskEntity, { onDelete: 'CASCADE' })
  pushTask: PushTaskEntity

  @Column()
  visitorId: string
}
