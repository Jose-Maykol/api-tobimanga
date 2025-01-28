import { CommandHandler } from '@nestjs/cqrs'
import { SetUserMangaReadingStatusCommand } from '../set-user-manga-reading-status.command'
import { MangaRepository } from '../../../domain/repositories/manga.repository'
import { UserMangaRepository } from '../../../domain/repositories/user-manga.repository'
import { UserMangaFactory } from '../../../domain/factories/user-manga.factory'

@CommandHandler(SetUserMangaReadingStatusCommand)
export class SetUserMangaReadingStatusHandler {
  constructor(
    private readonly mangaRepository: MangaRepository,
    private readonly userMangaRepository: UserMangaRepository,
    private readonly userMangaFactory: UserMangaFactory,
  ) {}

  async execute(command: SetUserMangaReadingStatusCommand) {
    const { userId, mangaId, status } = command

    const mangaExists = await this.mangaRepository.exists(mangaId)

    if (!mangaExists) {
      throw new Error('Este manga no existe')
    }

    //TODO: Validar si el usuario existe

    const newUserManga = this.userMangaFactory.create({
      userId,
      mangaId,
      readingStatus: status,
    })

    await this.userMangaRepository.save(userId, mangaId, newUserManga)

    return {
      message: 'El estado de lectura del manga del usuario ha sido actualizado',
    }
  }
}
