import { ICommand } from '@nestjs/cqrs'

export class SaveReadingMangaChapterCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly chapterId: string,
  ) {}
}
