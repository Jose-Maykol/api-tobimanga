import { Inject, Injectable, Logger } from '@nestjs/common'

import { CronJobKey } from '@/modules/admin/cron-job-management/domain/enums/cron-job-key.enum'
import { ICronJobHandler } from '@/modules/admin/cron-job-management/domain/interfaces/cron-job-handler.interface'
import { CronJobHandler } from '@/modules/admin/cron-job-management/infrastructure/decorators/cron-job-handler.decorator'

import { MangaRepository } from '../../domain/repositories/manga.repository'
import { MANGA_REPOSITORY } from '../../domain/tokens'

@Injectable()
@CronJobHandler(CronJobKey.SYNC_MANGA_CHAPTERS)
export class SyncMangaChaptersHandler implements ICronJobHandler {
  private readonly logger = new Logger(SyncMangaChaptersHandler.name)

  constructor(
    @Inject(MANGA_REPOSITORY)
    private readonly mangaRepository: MangaRepository,
  ) {}

  async execute(
    options?: Record<string, unknown>,
    signal?: AbortSignal,
  ): Promise<void> {
    const limit = (options?.limit as number) || 50
    this.logger.log(
      `Starting manga chapters synchronization (limit: ${limit})...`,
    )

    const mangas = await this.mangaRepository.findAll(1, limit)

    await new Promise((resolve) => setTimeout(resolve, 10000))

    let syncedCount = 0
    for (const manga of mangas) {
      if (signal?.aborted) {
        this.logger.warn('Synchronization aborted manually.')
        throw new Error('Ejecución cancelada manualmente')
      }

      if (manga.scrappingName) {
        this.logger.log(
          `Syncing chapters for manga: "${manga.originalName}" [Slug: ${manga.slugName}, ScrappingName: ${manga.scrappingName}]`,
        )

        syncedCount++
      } else {
        this.logger.debug(
          `Skipping manga "${manga.originalName}" - no scrapping identifier provided.`,
        )
      }
    }

    this.logger.log(
      `Manga chapters synchronization completed. Total synced: ${syncedCount}`,
    )
  }
}
