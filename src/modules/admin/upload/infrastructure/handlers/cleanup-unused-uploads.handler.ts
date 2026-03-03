import { Inject, Injectable, Logger } from '@nestjs/common'

import { IMAGE_STORAGE_SERVICE } from '@/core/storage/constants/storage.constants'
import { StorageService } from '@/core/storage/interfaces/storage.service'
import { CronJobKey } from '@/modules/admin/cron-job-management/domain/enums/cron-job-key.enum'
import { ICronJobHandler } from '@/modules/admin/cron-job-management/domain/interfaces/cron-job-handler.interface'
import { CronJobHandler } from '@/modules/admin/cron-job-management/infrastructure/decorators/cron-job-handler.decorator'

import { UploadRepository } from '../../domain/repositories/upload.repository'
import { UPLOAD_REPOSITORY } from '../../domain/tokens'

const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000

@Injectable()
@CronJobHandler(CronJobKey.CLEANUP_UNUSED_UPLOADS)
export class CleanupUnusedUploadsHandler implements ICronJobHandler {
  private readonly logger = new Logger(CleanupUnusedUploadsHandler.name)

  constructor(
    @Inject(UPLOAD_REPOSITORY)
    private readonly uploadRepository: UploadRepository,
    @Inject(IMAGE_STORAGE_SERVICE)
    private readonly storageService: StorageService,
  ) {}

  async execute(
    _options?: Record<string, unknown>,
    signal?: AbortSignal,
  ): Promise<void> {
    const cutoffDate = new Date(Date.now() - TWENTY_FOUR_HOURS_MS)

    this.logger.log(
      `Starting cleanup of unused uploads created before ${cutoffDate.toISOString()}...`,
    )

    const unusedUploads =
      await this.uploadRepository.findUnusedSince(cutoffDate)

    if (unusedUploads.length === 0) {
      this.logger.log('No unused uploads found. Cleanup complete.')
      return
    }

    this.logger.log(`Found ${unusedUploads.length} unused upload(s) to delete.`)

    let deletedCount = 0
    let failedCount = 0

    for (const upload of unusedUploads) {
      if (signal?.aborted) {
        this.logger.warn('Cleanup aborted manually.')
        throw new Error('Ejecución cancelada manualmente')
      }

      try {
        await this.storageService.delete(upload.objectKey)
        await this.uploadRepository.deleteById(upload.id)

        this.logger.debug(
          `Deleted unused upload: id=${upload.id}, key=${upload.objectKey}, file=${upload.fileName}`,
        )

        deletedCount++
      } catch (error) {
        this.logger.error(
          `Failed to delete upload id=${upload.id} (key=${upload.objectKey}): ${error.message}`,
          error.stack,
        )
        failedCount++
      }
    }

    this.logger.log(
      `Cleanup complete. Deleted: ${deletedCount}, Failed: ${failedCount}.`,
    )
  }
}
