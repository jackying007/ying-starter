import { IsArray, IsNumber, IsOptional } from 'class-validator'
import { Type } from 'class-transformer'

export class ListDto {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  page?: number

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  size?: number

  @IsOptional()
  @IsArray()
  date?: string[]
}
