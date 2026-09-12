import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm'
import { SysRoleEntity } from './sys.role.entity'
import { BaseEntityWithoutId } from './base'

@Entity('sys_permission')
export class SysPermissionEntity extends BaseEntityWithoutId {
  @Column({
    nullable: true
  })
  sortId?: number

  @Column()
  label: string

  @PrimaryColumn()
  code: string

  @Column({
    nullable: true
  })
  parentCode: string | null

  @ManyToOne(() => SysPermissionEntity, sysPermission => sysPermission.children, {
    nullable: true,
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'parentCode', referencedColumnName: 'code' })
  parent?: SysPermissionEntity

  @OneToMany(() => SysPermissionEntity, sysPermission => sysPermission.parent)
  children: SysPermissionEntity[]

  @ManyToMany(() => SysRoleEntity, role => role.permissions, { onDelete: 'CASCADE' })
  roles: SysRoleEntity[]
}
