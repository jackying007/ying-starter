import { IsBoolean, IsEnum, IsOptional } from 'class-validator'
import { Type } from 'class-transformer'
import { ListDto } from '../base'
import { FileSourceType, FileType } from './file.enum'

export class ListFileDto extends ListDto {
  @IsEnum(FileType)
  @IsOptional()
  type?: FileType

  @IsEnum(FileSourceType)
  @IsOptional()
  from?: FileSourceType

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  isExternal?: boolean
}
