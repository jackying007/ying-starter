import { Column, Entity, JoinColumn, OneToOne, OneToMany, ManyToMany } from 'typeorm'
import { BaseEntityWithAutoId } from './base'
import { FileEntity } from './file.entity'
import { OAuthAccountEntity } from './oauth.account.entity'
import { VisitorEntity } from './visitor.entity'

@Entity({ name: 'user' })
export class UserEntity extends BaseEntityWithAutoId {
  @Column({ type: 'varchar', nullable: true })
  name?: string

  @Column({ type: 'varchar', unique: true })
  email: string

  @Column({ type: 'boolean' })
  emailVerified: boolean

  @Column({ type: 'varchar', nullable: true })
  password?: string

  @Column({
    nullable: true
  })
  avatarId?: number

  @OneToOne(() => FileEntity)
  @JoinColumn()
  avatar?: FileEntity

  @OneToMany(() => OAuthAccountEntity, oauthAccount => oauthAccount.user)
  oauthAccounts?: OAuthAccountEntity[]

  @ManyToMany(() => VisitorEntity, visitor => visitor.users)
  visitors?: VisitorEntity[]
}
