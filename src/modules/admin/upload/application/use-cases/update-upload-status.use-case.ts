import { Inject, Injectable, Logger } from '@nestjs/common'

import { UploadNotFoundException } from '@/modules/admin/upload/domain/exceptions/upload-not-found.exception'

import { Upload, UploadStatus } from '../../domain/entities/upload.entity'
import { UploadRepository } from '../../domain/repositories/upload.repository'
import { UPLOAD_REPOSITORY } from '../../domain/tokens'

export type UpdateUploadStatusParams = {
  id: string
  status: UploadStatus
  usedAt?: Date
}

@Injectable()
export class UpdateUploadStatusUseCase {
  private readonly logger = new Logger(UpdateUploadStatusUseCase.name)

  constructor(
    @Inject(UPLOAD_REPOSITORY)
    private readonly uploadRepository: UploadRepository,
  ) { }

  async execute(params: UpdateUploadStatusParams): Promise<Upload> {
    if (params.status === UploadStatus.ACTIVE && !params.usedAt) {
      params.usedAt = new Date()
    }

    const upload = await this.uploadRepository.findById(params.id)

    if (upload === null) {
      this.logger.warn(`Upload not found with ID ${params.id}`)
      throw new UploadNotFoundException(params.id)
    }

    const result = await this.uploadRepository.updateStatus(
      params.id,
      params.status,
      params.usedAt,
    )

    this.logger.log(
      `Upload status updated to ${params.status} for ID ${params.id}`,
    )

    return result
  }
}
