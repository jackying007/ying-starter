import { Column, Entity, ManyToOne } from 'typeorm'
import { type PushData, PushRecordStatus } from '@ying/shared'
import { BaseEntityWithAutoId, PushTaskEntity } from '.'

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
