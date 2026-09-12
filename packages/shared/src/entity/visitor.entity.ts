import { Column, Entity, JoinTable, ManyToMany } from 'typeorm'
import type { PushSubscription } from 'web-push'
import { BaseEntityWithoutId } from './base'
import { UserEntity } from './user.entity'

@Entity({ name: 'visitor' })
export class VisitorEntity extends BaseEntityWithoutId {
  @Column({
    primary: true
  })
  visitorId: string

  @Column({
    type: 'simple-json',
    nullable: true
  })
  languages?: string[]

  @Column({
    nullable: true
  })
  userAgent?: string

  @Column({
    nullable: true
  })
  deviceType?: string

  @Column({
    type: 'simple-json',
    nullable: true
  })
  pushSubscription?: PushSubscription | null

  @ManyToMany(() => UserEntity, user => user.visitors)
  @JoinTable({
    name: 'visitor_associated_user',
    joinColumn: {
      name: 'visitorId',
      referencedColumnName: 'visitorId'
    },
    inverseJoinColumn: {
      name: 'userId',
      referencedColumnName: 'id'
    }
  })
  users?: UserEntity[]
}
