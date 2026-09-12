import { ArrayMaxSize, ArrayMinSize, ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from 'class-validator'

export class StatDto {
  @IsString()
  type: 'hour' | 'day'

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(2)
  @ArrayMinSize(2)
  @IsNotEmpty()
  date: string[]
}
