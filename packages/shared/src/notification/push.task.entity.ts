import { Column, Entity, ManyToOne } from 'typeorm'
import { BaseEntityWithAutoId } from '../base'
import { PushTaskStatus } from './enum'
import { PushTemplateEntity } from './push.template.entity'

export type TaskStatus = {
  pushing: number
  success: number
  fail: number
  click: number
}

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
