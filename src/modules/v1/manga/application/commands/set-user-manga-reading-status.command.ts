import { ICommand } from '@nestjs/cqrs'
import { ReadingStatusEnum } from '../../domain/entities/user-manga.entity'

export class SetUserMangaReadingStatusCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly mangaId: string,
    public readonly status: ReadingStatusEnum,
  ) {}
}
