import { IsEnum, IsOptional, IsUUID } from 'class-validator'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { ReadingStatus } from '../../domain/value-objects/reading-status.vo'

export class FollowMangaDto {
  @ApiProperty({
    description: 'ID del manga a seguir',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsUUID()
  mangaId: string

  @ApiPropertyOptional({
    description: 'Estado inicial de lectura (por defecto: PLANNING_TO_READ)',
    example: 'PLANNING_TO_READ',
    enum: ReadingStatus,
  })
  @IsOptional()
  @IsEnum(ReadingStatus)
  initialStatus?: ReadingStatus
}
