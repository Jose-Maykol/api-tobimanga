import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { FindMangaQuery } from '../find-manga.query'
import { MangaRepository } from '../../../domain/repositories/manga.repository'
import { Inject, NotFoundException } from '@nestjs/common'

@QueryHandler(FindMangaQuery)
export class FindMangaHandler implements IQueryHandler<FindMangaQuery> {
  constructor(
    @Inject('MangaRepository')
    private readonly mangaRepository: MangaRepository,
  ) {}

  async execute(query: FindMangaQuery): Promise<any> {
    const { slug } = query
    const title = slug.replace(/-/g, ' ')
    const manga = await this.mangaRepository.findOneByTitle(title)

    if (!manga) {
      throw new NotFoundException(`Manga ${slug} not found`)
    }

    return manga
  }
}
