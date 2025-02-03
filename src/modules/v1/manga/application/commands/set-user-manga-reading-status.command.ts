import { ICommand } from '@nestjs/cqrs'
import { MangaReadingStatus } from '../../domain/enums/manga-reading-status.enum'

export class SetUserMangaReadingStatusCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly mangaId: string,
    public readonly status: MangaReadingStatus,
  ) {}
}
