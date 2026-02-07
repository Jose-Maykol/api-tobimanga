import { Inject, Injectable, Logger } from '@nestjs/common'

import { MangaNotFoundException } from '@/core/domain/exceptions/manga/manga-not-found'
import { MangaRepository } from '@/core/domain/repositories/manga.repository'
import { MANGA_REPOSITORY } from '@/infrastructure/tokens/repositories'

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

    this.logger.log(`Retrieved manga with ID: ${id}`)

    return manga
  }
}
