import { CommandHandler } from '@nestjs/cqrs'
import { SetUserMangaReadingStatusCommand } from '../set-user-manga-reading-status.command'
import { MangaRepository } from '../../../domain/repositories/manga.repository'
import { UserMangaRepository } from '../../../domain/repositories/user-manga.repository'
import { UserMangaFactory } from '../../../domain/factories/user-manga.factory'
import { Inject, NotFoundException } from '@nestjs/common'

@CommandHandler(SetUserMangaReadingStatusCommand)
export class SetUserMangaReadingStatusHandler {
  constructor(
    @Inject('MangaRepository')
    private readonly mangaRepository: MangaRepository,
    @Inject('UserMangaRepository')
    private readonly userMangaRepository: UserMangaRepository,
    private readonly userMangaFactory: UserMangaFactory,
  ) {}

  async execute(command: SetUserMangaReadingStatusCommand) {
    const { userId, mangaId, status } = command
    const mangaExists = await this.mangaRepository.existsById(mangaId)

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
