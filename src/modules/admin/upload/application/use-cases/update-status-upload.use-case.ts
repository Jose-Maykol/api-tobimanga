import { Inject, Injectable } from '@nestjs/common'

import { UploadStatus } from '@/core/domain/entities/upload.entity'
import { UploadRepository } from '@/core/domain/repositories/upload.repository'

export type UpdateStatusUploadParams = {
  id: string
  status: UploadStatus
  usedAt?: Date
}

@Injectable()
export class UpdateStatusUploadUseCase {
  constructor(
    @Inject('UploadRepository')
    private readonly uploadRepository: UploadRepository,
  ) {}

  async execute(params: UpdateStatusUploadParams): Promise<void> {
    if (params.status === UploadStatus.ACTIVE && !params.usedAt) {
      params.usedAt = new Date()
    }

    await this.uploadRepository.updateStatus(
      params.id,
      params.status,
      params.usedAt,
    )
  }
}
