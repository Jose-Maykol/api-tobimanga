import { Chapter } from '../entities/chapter.entity'

export interface ChapterRepository {
  findById(id: string): Promise<Chapter | null>
  findByMangaId(mangaId: string): Promise<Chapter[]>
  saveMany(mangaId: string, chapterCount: number): Promise<void>
}
