import { Column, Entity, JoinColumn, ManyToMany, OneToOne } from 'typeorm'
import { BasicStatus, BaseEntityWithAutoId } from '../base'
import { FileEntity } from '../file'
import { SysRoleEntity } from './sys.role.entity'
import { SysPermissionEntity } from './sys.permission.entity'

@Entity('sys_user')
export class SysUserEntity extends BaseEntityWithAutoId {
  @Column()
  name: string

  @Column({
    unique: true
  })
  account: string

  @Column({
    nullable: true
  })
  email?: string

  @Column()
  password: string

  @Column({
    nullable: true
  })
  avatarId?: number

  @OneToOne(() => FileEntity)
  @JoinColumn()
  avatar?: FileEntity

  @Column({
    type: 'smallint',
    default: BasicStatus.ENABLE
  })
  status: BasicStatus

  @Column({
    nullable: true
  })
  remark: string

  @ManyToMany(() => SysRoleEntity, role => role.users, { onDelete: 'CASCADE' })
  roles: SysRoleEntity[]

  permissions?: SysPermissionEntity[]
}
