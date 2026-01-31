import { IsString, Length } from 'class-validator'

export class UpdateGenreDto {
  @IsString()
  @Length(3, 100)
  name: string
}
