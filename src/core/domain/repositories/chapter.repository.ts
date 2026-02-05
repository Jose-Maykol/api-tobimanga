import { Chapter } from '../entities/chapter.entity'

export interface ChapterRepository {
  findById(id: string): Promise<Chapter | null>
  findByMangaId(
    mangaId: string,
    page: number,
    limit: number,
    order: 'asc' | 'desc',
  ): Promise<Chapter[]>
  countAllByMangaId(mangaId: string): Promise<number>
  saveMany(mangaId: string, chapterCount: number): Promise<void>
}
