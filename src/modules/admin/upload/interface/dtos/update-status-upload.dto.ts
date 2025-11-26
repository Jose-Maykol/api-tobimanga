import { IsEnum, IsOptional, IsUUID } from 'class-validator'

import { UploadStatus } from '@/core/domain/entities/upload.entity'

export class UpdateStatusUploadDto {
  @IsUUID('4', { message: 'El id debe ser un UUID válido' })
  id: string

  @IsEnum(UploadStatus, {
    message: 'El estado debe ser un valor válido de UploadStatus',
  })
  status: UploadStatus

  @IsOptional()
  usedAt?: Date
}
