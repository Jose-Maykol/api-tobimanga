import { Manga } from '../entities/manga.entity'

export interface MangaRepository {
  findByTitle(title: string): Promise<Manga | null>
  findById(id: string): Promise<Manga | null>
  save(manga: Manga): Promise<Manga>
}
