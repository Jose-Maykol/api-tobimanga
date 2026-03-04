import { ChapterListItemDto } from '../../application/dtos/chapter-list.dto'
import {
  MangaDetailDto,
  MangaListItemDto,
} from '../../application/dtos/manga-list.dto'
import { FindChaptersDto } from '../dtos/find-chapters.dto'
import { FindMangasDto } from '../dtos/find-mangas.dto'

export interface IMangaCatalogRepository {
  findMangas(params: FindMangasDto): Promise<MangaListItemDto[]>
  countMangas(params: FindMangasDto): Promise<number>
  findBySlug(slugName: string): Promise<MangaDetailDto | null>
  findMangaIdBySlug(slug: string): Promise<string | null>
  findChaptersByMangaId(
    mangaId: string,
    params: FindChaptersDto,
  ): Promise<ChapterListItemDto[]>
  countChaptersByMangaId(mangaId: string): Promise<number>
}
