import { CommandHandler } from '@nestjs/cqrs'
import { DeleteReadingMangaChapterCommnad } from '../delete-reading-manga-chapter.command'
import { Inject } from '@nestjs/common'
import { UserChapterRepository } from '../../../domain/repositories/user-chapter.repository'

@CommandHandler(DeleteReadingMangaChapterCommnad)
export class DeleteReadingMangaChapterHandler {
  constructor(
    @Inject('UserChapterRepository')
    private readonly userChapterRepository: UserChapterRepository,
  ) {}

  async execute(command: DeleteReadingMangaChapterCommnad) {
    const { userId, chapterId } = command

    await this.userChapterRepository.delete(userId, chapterId)

    return {
      message: 'Capitulo eliminado de la lista de leidos con exito',
    }
  }
}
