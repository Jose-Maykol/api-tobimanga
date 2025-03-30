import { CommandHandler, QueryBus } from '@nestjs/cqrs'
import { SetUserMangaReadingStatusCommand } from '../set-user-manga-reading-status.command'
import { UserMangaRepository } from '../../../domain/repositories/user-manga.repository'
import { UserMangaFactory } from '../../../domain/factories/user-manga.factory'
import { Inject, NotFoundException } from '@nestjs/common'
import { GetMangaExistsQuery } from '@/modules/v1/manga/application/queries/get-manga-exists.query'

@CommandHandler(SetUserMangaReadingStatusCommand)
export class SetUserMangaReadingStatusHandler {
  constructor(
    @Inject('UserMangaRepository')
    private readonly userMangaRepository: UserMangaRepository,
    private readonly userMangaFactory: UserMangaFactory,
    private readonly queryBus: QueryBus,
  ) {}

  async execute(command: SetUserMangaReadingStatusCommand) {
    const { userId, mangaId, status } = command
    const mangaExists = await this.queryBus.execute(new GetMangaExistsQuery(mangaId))

    if (!mangaExists) {
      throw new NotFoundException('El manga no existe')
    }

    const newUserManga = this.userMangaFactory.create({
      userId,
      mangaId,
      readingStatus: status,
    })

    await this.userMangaRepository.save(newUserManga)

    return {
      message: 'El estado de lectura del manga del usuario ha sido actualizado',
    }
  }
}
