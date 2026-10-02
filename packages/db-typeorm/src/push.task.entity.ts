import { Column, Entity, ManyToOne } from 'typeorm'
import { PushTaskStatus, type TaskStatus } from '@ying/shared'
import { BaseEntityWithAutoId, PushTemplateEntity } from '.'

@Entity({ name: 'push_task' })
export class PushTaskEntity extends BaseEntityWithAutoId {
  @Column()
  name: string

  @Column({
    type: 'timestamptz',
    nullable: true
  })
  time?: Date | null

  @Column({
    nullable: true
  })
  deviceType?: string

  @Column()
  pushTemplateId: number

  @ManyToOne(() => PushTemplateEntity)
  pushTemplate: PushTemplateEntity

  @Column({
    type: 'smallint',
    default: PushTaskStatus.Wait
  })
  status: PushTaskStatus

  taskStatus?: TaskStatus
}
