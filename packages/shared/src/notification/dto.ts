import { Type } from 'class-transformer'
import { IsNotEmpty, IsOptional, IsString, ValidateNested, IsEnum, IsNumber, IsArray } from 'class-validator'

import { ListDto, IsIntlText, type TIntlText } from '../base'
import { DeviceType } from './enum'

export class ListVisitorDto extends ListDto {
  @IsOptional()
  language?: string

  @IsEnum(DeviceType)
  @IsOptional()
  deviceType?: DeviceType
}

export class SendPushTemplateDto {
  @IsString()
  @IsNotEmpty()
  visitorId: string

  @IsNumber()
  @IsNotEmpty()
  pushTemplateId: number
}

export class PushActionDto {
  @IsIntlText({ minLength: 2, maxLength: 6 })
  title: TIntlText

  @IsString()
  @IsOptional()
  link?: string
}

export class CreatePushTemplateDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsIntlText()
  title: TIntlText

  @IsString()
  @IsOptional()
  link?: string

  @IsIntlText({ canEmpty: true })
  body?: TIntlText

  @IsNumber()
  @IsOptional()
  imageId?: number

  @ValidateNested({ each: true })
  @Type(() => PushActionDto)
  actions?: PushActionDto[]
}

export class UpdatePushTemplateDto extends CreatePushTemplateDto {
  @IsNumber()
  @IsNotEmpty()
  id: number
}

export class ListPushTemplateDto extends ListDto {
  @IsOptional()
  name?: string

  @IsOptional()
  title?: string
}

export class CreatePushTaskDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsOptional()
  deviceType?: string

  @IsNumber()
  @IsNotEmpty()
  pushTemplateId: number
}

export class UpdatePushTaskDto extends CreatePushTaskDto {
  @IsNumber()
  @IsNotEmpty()
  id: number
}

export class ListPushTaskDto extends ListDto {
  @IsOptional()
  name?: string
}

export class SetPushTaskDto {
  @IsNumber()
  @IsNotEmpty()
  id: number

  @IsString()
  @IsOptional()
  time?: string
}

export class ListPushRecordDto extends ListDto {
  @IsString()
  @IsOptional()
  visitorId?: string

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  pushTaskId?: number

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  status?: number
}

export class CreateVisitorDto {
  @IsString()
  visitorId: string

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  languages?: string[]

  @IsString()
  @IsOptional()
  userAgent?: string

  @IsString()
  @IsOptional()
  deviceType?: string
}

class KeysDto {
  @IsString()
  @IsNotEmpty()
  p256dh: string

  @IsString()
  @IsNotEmpty()
  auth: string
}

class SubscriptionDto {
  @IsString()
  @IsNotEmpty()
  endpoint: string

  @ValidateNested()
  @Type(() => KeysDto)
  keys: KeysDto
}

export class NoticeSubscribeDto {
  @IsString()
  @IsNotEmpty()
  visitorId: string

  @ValidateNested()
  @Type(() => SubscriptionDto)
  @IsNotEmpty()
  pushSubscription: SubscriptionDto
}
