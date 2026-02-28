import { IsNotEmpty, IsString, Length } from 'class-validator'

export class CreateGenreDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  name: string
}
