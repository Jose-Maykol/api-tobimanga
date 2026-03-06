import { Inject, Injectable } from '@nestjs/common'

import { Manga } from '../../domain/entities/manga.entity'
import { MangaNotFoundException } from '../../domain/exceptions/manga-not-found.exception'
import { MangaRepository } from '../../domain/repositories/manga.repository'
import { MANGA_REPOSITORY } from '../../domain/tokens'

@Injectable()
export class ActivateMangaUseCase {
  constructor(
    @Inject(MANGA_REPOSITORY)
    private readonly mangaRepository: MangaRepository,
  ) {}

  async execute(id: string): Promise<Manga> {
    const manga = await this.mangaRepository.findById(id)

    if (!manga) {
      throw new MangaNotFoundException(id)
    }

    manga.active = true
    return await this.mangaRepository.update(manga)
  }
}
