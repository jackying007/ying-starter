import { Column, Entity, JoinTable, ManyToMany } from 'typeorm'
import { BasicStatus } from '@ying/shared'
import { BaseEntityWithAutoId, SysPermissionEntity, SysUserEntity } from '.'

@Entity('sys_role')
export class SysRoleEntity extends BaseEntityWithAutoId {
  @Column({ unique: true })
  name: string

  @Column({
    type: 'smallint',
    default: BasicStatus.ENABLE
  })
  status: BasicStatus

  @Column({ type: 'boolean', default: false })
  systemic: boolean

  @Column({
    nullable: true
  })
  remark: string

  @Column({
    default: 0
  })
  sort: number

  @ManyToMany(() => SysPermissionEntity, permission => permission.roles, { cascade: true, onDelete: 'CASCADE' })
  @JoinTable({ name: 'sys_role_associated_sys_permission' })
  permissions: SysPermissionEntity[]

  @ManyToMany(() => SysUserEntity, user => user.roles, { cascade: true, onDelete: 'CASCADE' })
  @JoinTable({ name: 'sys_role_associated_sys_user' })
  users: SysUserEntity[]
}
