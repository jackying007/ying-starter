import { Column, Entity } from 'typeorm'
import { BaseEntityWithAutoId } from './base'

@Entity({ name: 'feedback' })
export class FeedbackEntity extends BaseEntityWithAutoId {
  @Column()
  firstName: string

  @Column()
  lastName: string

  @Column()
  email: string

  @Column()
  content: string
}
