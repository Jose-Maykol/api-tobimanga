import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { UserChapterRepository } from '../../../../user/domain/repositories/user-chapter.repository'
import { Inject } from '@nestjs/common'
import { UserChapter } from '@/modules/v1/user/domain/entities/user-chapter.entitiy'
import { SaveReadingMangaChapterCommand } from '../save-reading-manga-chapter.command'

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
