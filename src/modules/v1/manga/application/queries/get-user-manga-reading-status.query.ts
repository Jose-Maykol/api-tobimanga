import { IQuery } from '@nestjs/cqrs'

export class GetUserMangaReadingStatusQuery implements IQuery {
  readonly mangaId: string
  readonly userId: string

  constructor(mangaId: string, userId: string) {
    this.mangaId = mangaId
    this.userId = userId
  }
}
