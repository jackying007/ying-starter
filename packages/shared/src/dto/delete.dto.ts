import { IsArray, IsNotEmpty, IsNumber } from 'class-validator'

export class DeleteDto {
  @IsArray()
  @IsNumber(undefined, { each: true })
  @IsNotEmpty()
  ids: number[]
}
