import { IsEnum, IsOptional } from 'class-validator'

import { PaginationDto } from '@/common/dto/pagination.dto'

export class ListChaptersDto extends PaginationDto {
  mangaId: string

  @IsOptional()
  @IsEnum(['asc', 'desc'], { message: 'order debe ser asc o desc' })
  order?: 'asc' | 'desc' = 'desc'
}
