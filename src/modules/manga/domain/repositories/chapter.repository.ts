import { Chapter } from '../entities/chapter.entity'

export interface ChapterRepository {
  findById(id: string): Promise<Chapter | null>
  save(chapter: Chapter): Promise<Chapter>
}
