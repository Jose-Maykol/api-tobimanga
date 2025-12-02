import { Manga } from '../entities/manga.entity'

export interface MangaRepository {
  /* findByTitle(title: string): Promise<Manga | null>
  findById(id: string): Promise<Manga | null>
  findAll(): Promise<Manga[]> */
  save(manga: Manga): Promise<Manga>
  findAll(page: number, limit: number): Promise<Manga[]>
  countAll(): Promise<number>
  existBySlugName(slugName: string): Promise<boolean>
}
