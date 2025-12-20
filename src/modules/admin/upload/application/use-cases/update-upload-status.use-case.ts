import { Inject, Injectable } from '@nestjs/common'

import { Upload, UploadStatus } from '@/core/domain/entities/upload.entity'
import { UploadNotFoundException } from '@/core/domain/exceptions/upload/upload-not-found'
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
   * Updates the status of an upload.
   * If the status is ACTIVE and usedAt is not provided, sets usedAt to the current date.
   * @param params - Object containing:
   *   - id: string - The identifier of the upload.
   *   - status: UploadStatus - The new status to set.
   *   - usedAt?: Date - Optional date when the upload was used.
   * @returns Promise<Upload> - The updated upload entity.
   */
  async execute(params: UpdateUploadStatusParams): Promise<Upload> {
    if (params.status === UploadStatus.ACTIVE && !params.usedAt) {
      params.usedAt = new Date()
    }

    const upload = await this.uploadRepository.findById(params.id)

    if (upload === null) throw new UploadNotFoundException()

    const result = await this.uploadRepository.updateStatus(
      params.id,
      params.status,
      params.usedAt,
    )

    return result
  }
}
