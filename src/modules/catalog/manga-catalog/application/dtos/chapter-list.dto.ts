import { IsEnum, IsOptional } from 'class-validator'

import { PaginationDto } from '@/common/dto/pagination.dto'

export class ListChaptersDto extends PaginationDto {
  @IsOptional()
  @IsEnum(['ASC', 'DESC'], { message: 'order debe ser ASC o DESC' })
  order?: 'ASC' | 'DESC' = 'DESC'
}

export class ChapterListItemDto {
  id: string
  chapterNumber: number
  title: string | null
  releaseDate: Date | null
}
