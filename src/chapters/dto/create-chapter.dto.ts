import { IsDate, IsNumber, IsString } from 'class-validator'

export class CreateChapterDto {
  @IsString()
  manga_id: string

  @IsNumber()
  chapter_number: number

  @IsDate()
  release_date: Date
}
