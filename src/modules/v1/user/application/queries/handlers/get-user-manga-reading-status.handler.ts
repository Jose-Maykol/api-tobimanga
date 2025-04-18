import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { GetUserMangaReadingStatusQuery } from '../get-user-manga-reading-status.query'
import { UserMangaRepository } from '../../../domain/repositories/user-manga.repository'
import { Inject, NotFoundException } from '@nestjs/common'

@QueryHandler(GetUserMangaReadingStatusQuery)
export class GetUserMangaReadingStatusHandler
  implements IQueryHandler<GetUserMangaReadingStatusQuery>
{
  constructor(
    @Inject('UserMangaRepository')
    private readonly userMangaRepository: UserMangaRepository,
  ) {}

  async execute(query: GetUserMangaReadingStatusQuery) {
    const { mangaId, userId } = query
    const userManga = await this.userMangaRepository.find(mangaId, userId)

    // TODO: SE DEBE HACER UN EXCEPCION PERSONALIZADA PARA MANGA NO ENCONTRADO
    // * SE PUEDE TENER EL RECUENTO DE CAPITULOS LEIDOS Y TOTAL DE CAPITULOS
    // * SE PUEDE TENER CUANDO FUE LEIDO EL ULTIMO CAPITULO

    if (!userManga)
      throw new NotFoundException('El usuario no tiene este manga en su lista')

    return {
      rating: userManga.rating,
      readingStatus: userManga.readingStatus,
      createdAt: userManga.createdAt,
      updatedAt: userManga.updatedAt,
    }
  }
}
