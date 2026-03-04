import { IsEnum, IsOptional } from 'class-validator'

import { PaginationDto } from '@/common/dto/pagination.dto'

export class ListUserChaptersDto extends PaginationDto {
  @IsOptional()
  @IsEnum(['ASC', 'DESC'], { message: 'order debe ser ASC o DESC' })
  order?: 'ASC' | 'DESC' = 'DESC'
}
