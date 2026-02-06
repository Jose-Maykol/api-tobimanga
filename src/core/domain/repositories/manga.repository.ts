import { PublicationStatus } from '../../../modules/manga/application/enums/publication-status.enum'
import { Manga } from '../entities/manga.entity'

export interface MangaRepository {
  findAll(
    page: number,
    limit: number,
    publicationStatus?: PublicationStatus,
  ): Promise<Manga[]>
  countAll(publicationStatus?: PublicationStatus): Promise<number>
  existBySlugName(slugName: string): Promise<boolean>
  findById(id: string): Promise<Manga | null>
  save(manga: Manga): Promise<Manga>
  update(manga: Manga): Promise<Manga>
  incrementChapterCount(mangaId: string): Promise<void>
}
