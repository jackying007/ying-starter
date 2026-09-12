import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { BaseEntityWithAutoId } from './base'
import { UserEntity } from './user.entity'

export type OAuthProvider = 'google' | 'github'

@Entity({ name: 'oauth_account' })
export class OAuthAccountEntity extends BaseEntityWithAutoId {
  @Column({ type: 'varchar' })
  provider: OAuthProvider

  @Column()
  providerAccountId: string

  @Column()
  name: string

  @Column()
  avatar: string

  @Column()
  userId: number

  @ManyToOne(() => UserEntity, user => user.oauthAccounts)
  @JoinColumn()
  user: UserEntity
}
