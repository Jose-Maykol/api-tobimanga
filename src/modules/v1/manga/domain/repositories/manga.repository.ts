import { DeepPartial } from '@/modules/v1/shared/types/deep-partial'
import { Manga } from '../entities/manga.entity'
import MangaRecord from '../types/manga'
import ChapterRecord from '../types/chapter'
export interface MangaRepository {
  findPaginated(
    page: number,
    limit: number,
  ): Promise<[DeepPartial<MangaRecord[]>, { count: number }]>
  findPaginatedChaptersByMangaId(
    mangaId: string,
    page: number,
    limit: number,
  ): Promise<[DeepPartial<ChapterRecord[]>, { count: number }]>
  findOneByTitle(title: string): Promise<DeepPartial<MangaRecord> | null>
  existsByTitle(title: string): Promise<boolean>
  existsById(id: string): Promise<boolean>
  save(mangaEntity: Manga): Promise<void>
}
