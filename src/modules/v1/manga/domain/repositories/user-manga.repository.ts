export interface UserMangaRepository {
  save(userId: string, mangaId: string, readingStatus: string): Promise<void>
  createChapters(userId: string, mangaId: string): Promise<void>
}
