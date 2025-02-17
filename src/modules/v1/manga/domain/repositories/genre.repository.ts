import { Genre } from '../entities/genre.entity'

export interface GenreRepository {
  find(): Promise<Genre[] | null>
  findById(id: string): Promise<Genre | null>
  findByIds(ids: string[]): Promise<Genre[] | null>
  findByName(name: string): Promise<Genre | null>
  save(genre: Genre): Promise<Genre>
}
