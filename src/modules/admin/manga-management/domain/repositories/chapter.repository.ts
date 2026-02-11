import { Chapter } from '../entities/chapter.entity'

export interface ChapterRepository {
  findById(id: string): Promise<Chapter | null>
  findByMangaId(
    mangaId: string,
    page: number,
    limit: number,
    order: 'asc' | 'desc',
  ): Promise<Chapter[]>
  findByMangaIdAndChapterNumber(
    mangaId: string,
    chapterNumber: number,
  ): Promise<Chapter | null>
  getLastChapterNumber(mangaId: string): Promise<number | null>
  countAllByMangaId(mangaId: string): Promise<number>
  save(chapter: Chapter): Promise<Chapter>
  update(chapter: Chapter): Promise<Chapter>
  saveMany(mangaId: string, chapterCount: number): Promise<void>
}
