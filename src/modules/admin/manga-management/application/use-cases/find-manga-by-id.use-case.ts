import { Inject, Injectable, Logger } from '@nestjs/common'

import { MangaNotFoundException } from '@/modules/admin/manga-management/domain/exceptions/manga-not-found.exception'

// Manga entity import removed
import { MangaRepository } from '../../domain/repositories/manga.repository'
import { MANGA_REPOSITORY } from '../../domain/tokens'

@Injectable()
export class FindMangaByIdUseCase {
  private readonly logger = new Logger(FindMangaByIdUseCase.name)

  constructor(
    @Inject(MANGA_REPOSITORY)
    private readonly mangaRepository: MangaRepository,
  ) {}

  async execute(id: string) {
    const manga = await this.mangaRepository.findById(id)

    if (!manga) {
      throw new MangaNotFoundException(id)
    }

    this.logger.log(`Retrieved manga with ID: ${id} `)

    return manga
  }
}
