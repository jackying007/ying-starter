import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'
import { Type } from 'class-transformer'

import { BasicStatus, type TIntlText } from '../'

import { ListDto } from './list.dto'
import { IsIntlText } from './intl.validator'

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty({ message: '名称不能为空' })
  name: string

  @IsIntlText()
  title: TIntlText

  @IsArray()
  @IsOptional()
  keywords?: string[]

  @IsNumber()
  @IsNotEmpty({ message: '封面不能为空' })
  coverId: number

  @IsNumber()
  @IsOptional()
  sort?: number

  @IsNumber()
  @IsNotEmpty()
  status?: number
}

export class UpdateArticleDto extends CreateArticleDto {
  @IsNumber()
  @IsNotEmpty()
  id: number
}

export class UpdateArticleContentDto {
  @IsNumber()
  @IsNotEmpty()
  id: number

  @IsIntlText({ canEmpty: true })
  content?: TIntlText

  @IsNumber(undefined, { each: true })
  @IsArray()
  @IsOptional()
  associatedFileIds?: number[]
}

export class ListArticleDto extends ListDto {
  @IsString()
  @IsOptional()
  name?: string

  @IsEnum(BasicStatus)
  @IsOptional()
  @Type(() => Number)
  status?: BasicStatus
}
