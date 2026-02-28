import { IsNotEmpty, IsString, Length } from 'class-validator'

export class CreateGenreDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  name: string
}
