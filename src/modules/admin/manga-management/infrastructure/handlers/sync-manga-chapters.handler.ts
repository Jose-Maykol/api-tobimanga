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

  async execute(options?: Record<string, unknown>): Promise<void> {
    const limit = (options?.limit as number) || 50
    this.logger.log(
      `Starting manga chapters synchronization (limit: ${limit})...`,
    )

    // In a real scenario, you would probably filter by active mangas and those that have a scrappingName
    const mangas = await this.mangaRepository.findAll(1, limit)

    let syncedCount = 0
    for (const manga of mangas) {
      if (manga.scrappingName) {
        this.logger.log(
          `Syncing chapters for manga: "${manga.originalName}" [Slug: ${manga.slugName}, ScrappingName: ${manga.scrappingName}]`,
        )

        // Here you would call your scrapper logic.
        // For example: await this.scrapperService.syncManga(manga.scrappingName);

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
