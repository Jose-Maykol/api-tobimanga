import { IsEnum, IsNumber, IsOptional, Min } from 'class-validator'

export class ListChaptersDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number = 1

  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number = 20

  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC' = 'DESC'
}

export class ChapterListItemDto {
  id: string
  chapterNumber: number
  title: string | null
  releaseDate: Date | null
}
