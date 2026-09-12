import { Column, Entity } from 'typeorm'
import { BaseEntityWithAutoId } from '../base'
import { FileType, FileSourceType } from './file.enum'

export type TFileExtra = {
  size: number
  type: string
  width?: number
  height?: number
}

@Entity({ name: 'file' })
export class FileEntity extends BaseEntityWithAutoId {
  @Column({
    type: 'enum',
    enum: FileType
  })
  type: FileType

  @Column({
    type: 'enum',
    enum: FileSourceType
  })
  from: FileSourceType

  @Column({
    type: 'boolean',
    default: false
  })
  isExternal: boolean

  @Column()
  userId: number

  @Column({
    unique: true
  })
  path: string

  @Column({
    length: 2083
  })
  url: string

  @Column({
    type: 'simple-json',
    nullable: true
  })
  extra?: TFileExtra
}
