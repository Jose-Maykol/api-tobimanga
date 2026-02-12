import { IsEnum, IsOptional } from 'class-validator'

import { UploadStatus } from '@/modules/admin/upload/domain/entities/upload.entity'

export class UpdateStatusUploadDto {
  @IsEnum(UploadStatus, {
    message: 'El estado debe ser un valor válido de UploadStatus',
  })
  status: UploadStatus

  @IsOptional()
  usedAt?: Date
}
