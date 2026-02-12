import { Inject, Injectable, Logger } from '@nestjs/common'

import { IMangaCatalogRepository } from '../../domain/repositories/manga-catalog.repository'
import { MANGA_CATALOG_REPOSITORY } from '../../infrastructure/tokens'
import { MangaDetailDto } from '../dtos/manga-list.dto'

@Injectable()
export class FindMangaBySlugUseCase {
  private readonly logger = new Logger(FindMangaBySlugUseCase.name)

  constructor(
    @Inject(MANGA_CATALOG_REPOSITORY)
    private readonly mangaCatalogRepository: IMangaCatalogRepository,
  ) {}

  async execute(slugName: string): Promise<MangaDetailDto | null> {
    const manga = await this.mangaCatalogRepository.findBySlug(slugName)

    if (manga) {
      this.logger.log(`Retrieved manga detail for slug: ${slugName}`)
    } else {
      this.logger.warn(`Manga not found for slug: ${slugName}`)
    }

    return manga
  }
}
