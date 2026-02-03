import { IsString, Length } from 'class-validator'

export class UpdateAuthorDto {
  @IsString()
  @Length(3, 100)
  name: string
}
