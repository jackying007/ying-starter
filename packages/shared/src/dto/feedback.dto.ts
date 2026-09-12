import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator'
import { ListDto } from './list.dto'

export class CreateFeedbackDto {
  @MaxLength(10)
  @IsString()
  @IsOptional()
  firstName?: string

  @MaxLength(10)
  @IsString()
  @IsOptional()
  lastName?: string

  @IsEmail(undefined, { message: 'validation.incorrect_email_format' })
  @IsNotEmpty({ message: 'validation.email_should_not_be_empty' })
  email: string

  @MaxLength(300)
  @IsString()
  @IsNotEmpty({ message: 'validation.content_should_not_be_empty' })
  content: string
}

export class ListFeedbackDto extends ListDto {
  @IsOptional()
  email?: string
}
