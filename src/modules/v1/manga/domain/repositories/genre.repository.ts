import { Genre } from '../entities/genre.entity'

export interface GenreRepository {
  existsById(id: string): Promise<boolean>
  existsByName(name: string): Promise<boolean>
  find(): Promise<Genre[] | null>
  findById(id: string): Promise<Genre | null>
  findByIds(ids: string[]): Promise<Genre[] | null>
  findByName(name: string): Promise<Genre | null>
  save(genre: Genre): Promise<Genre>
}
