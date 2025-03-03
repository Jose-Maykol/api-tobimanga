import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { SaveReadingMangaChapterCommand } from '../save-reading-manga-chapter.command'
import { UserChapterRepository } from '../../../domain/repositories/user-chapter.repository'
import { UserChapter } from '../../../domain/entities/user-chapter.entitiy'
import { Inject } from '@nestjs/common'

@CommandHandler(SaveReadingMangaChapterCommand)
export class SaveReadingMangaChapterHandler
  implements ICommandHandler<SaveReadingMangaChapterCommand>
{
  constructor(
    @Inject('UserChapterRepository')
    private readonly userChapterRepository: UserChapterRepository,
  ) {}

  async execute(command: SaveReadingMangaChapterCommand) {
    const { userId, chapterId } = command

    const userChapter = new UserChapter({
      userId,
      chapterId,
      read: true,
      readAt: new Date(),
      createdAt: new Date(),
      updatedAt: null,
    })

    await this.userChapterRepository.save(userChapter)

    return {
      message: 'Capitulo marcado como leido con exito',
    }
  }
}
