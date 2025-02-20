import { CommandHandler } from '@nestjs/cqrs'
import { UpdateUserMangaReadingStatusCommand } from '../update-user-manga-reading-status.command'
import { MangaRepository } from '../../../domain/repositories/manga.repository'
import { Inject } from '@nestjs/common'

@CommandHandler(UpdateUserMangaReadingStatusCommand)
export class UpdateUserMangaReadingStatusHandler {
  constructor(
    @Inject('MangaRepository')
    private readonly mangaRepository: MangaRepository,
  ) {}

  async execute(command: UpdateUserMangaReadingStatusCommand) {
    const { userId, mangaId, status } = command

    console.log(`Updating user manga reading status: ${status}`)
    console.log(`User ID: ${userId}`)

    const mangaExists = await this.mangaRepository.existsById(mangaId)

    if (!mangaExists) {
      throw new Error('Este manga no existe')
    }

    //TODO: Validar si el usuario existe

    return {
      message: 'User manga reading status updated',
    }
  }
}
