import { Inject, Injectable } from '@nestjs/common'

import { UploadStatus } from '@/core/domain/entities/upload.entity'
import { UploadRepository } from '@/core/domain/repositories/upload.repository'
import { UPLOAD_REPOSITORY } from '@/infrastructure/tokens/repositories'

export type UpdateUploadStatusParams = {
  id: string
  status: UploadStatus
  usedAt?: Date
}

@Injectable()
export class UpdateUploadStatusUseCase {
  constructor(
    @Inject(UPLOAD_REPOSITORY)
    private readonly uploadRepository: UploadRepository,
  ) {}

  /**
   * Update the status of an upload.
   * If the status is ACTIVE and usedAt is not provided, sets usedAt to the current date.
   * @param params Object containing id, status, and optional usedAt.
   * @returns Promise<void>
   */
  async execute(params: UpdateUploadStatusParams): Promise<void> {
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
