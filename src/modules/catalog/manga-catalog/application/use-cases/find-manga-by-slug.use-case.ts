import { Inject, Injectable, Logger } from '@nestjs/common'

import { MangaCatalogRepository } from '../../infrastructure/repositories/manga-catalog.repository'
import { MangaDetailDto } from '../dtos/manga-list.dto'

@Injectable()
export class FindMangaBySlugUseCase {
  private readonly logger = new Logger(FindMangaBySlugUseCase.name)

  constructor(
    @Inject()
    private readonly mangaCatalogRepository: MangaCatalogRepository,
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
