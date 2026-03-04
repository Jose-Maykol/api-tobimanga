import { IsEnum, IsOptional } from 'class-validator'

import { PaginationDto } from '@/common/dto/pagination.dto'

import { PublicationStatus } from '../../domain/value-objects/publication-status.vo'

export class ListMangasDto extends PaginationDto {
  @IsOptional()
  @IsEnum(PublicationStatus, {
    message: 'publicationStatus debe ser un estado válido',
  })
  publicationStatus?: PublicationStatus
}
