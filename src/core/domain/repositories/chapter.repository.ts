import { Chapter } from '../entities/chapter.entity'

export interface ChapterRepository {
  findById(id: string): Promise<Chapter | null>
  saveMany(mangaId: string, chapterCount: number): Promise<void>
}
