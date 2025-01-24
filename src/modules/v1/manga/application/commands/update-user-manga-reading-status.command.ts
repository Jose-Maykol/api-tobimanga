import { ICommand } from '@nestjs/cqrs'

export class UpdateUserMangaReadingStatusCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly mangaId: string,
    public readonly status: string,
  ) {}
}
