
export class GetMangaExistsQuery {
  readonly mangaId: string

  constructor(mangaId: string) {
    this.mangaId = mangaId
  }
}