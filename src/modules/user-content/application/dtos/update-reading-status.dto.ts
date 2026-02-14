import { IsEnum } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import { ReadingStatus } from '../../domain/value-objects/reading-status.vo'

export class UpdateReadingStatusDto {
  @ApiProperty({
    description: 'Nuevo estado de lectura',
    example: 'COMPLETED',
    enum: ReadingStatus,
  })
  @IsEnum(ReadingStatus)
  status: ReadingStatus
}
