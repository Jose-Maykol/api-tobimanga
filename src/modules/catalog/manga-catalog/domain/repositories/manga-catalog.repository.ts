import { ChapterListItemDto } from '../../application/dtos/chapter-list.dto'
import {
  ListPublicMangasDto,
  MangaDetailDto,
  MangaListItemDto,
} from '../../application/dtos/manga-list.dto'

export interface IMangaCatalogRepository {
  findMangas(params: ListPublicMangasDto): Promise<MangaListItemDto[]>
  countMangas(params: ListPublicMangasDto): Promise<number>
  findBySlug(slugName: string): Promise<MangaDetailDto | null>
  findMangaIdBySlug(slug: string): Promise<string | null>
  findChaptersByMangaId(
    mangaId: string,
    page: number,
    limit: number,
    order: 'ASC' | 'DESC',
  ): Promise<ChapterListItemDto[]>
  countChaptersByMangaId(mangaId: string): Promise<number>
}
