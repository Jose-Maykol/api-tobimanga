import { Inject } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { MangaRepository } from '../../../domain/repositories/manga.repository'
import { GetMangaExistsQuery } from '../get-manga-exists.query'

@QueryHandler(GetMangaExistsQuery)
export class GetMangaExistsHandler
  implements IQueryHandler<GetMangaExistsQuery>
{
  constructor(
    @Inject('MangaRepository')
    private readonly mangaRepository: MangaRepository,
  ) {}

  async execute(query: GetMangaExistsQuery): Promise<boolean> {
    const { mangaId } = query
    const exists = await this.mangaRepository.existsById(mangaId)
    return exists
  }
}
