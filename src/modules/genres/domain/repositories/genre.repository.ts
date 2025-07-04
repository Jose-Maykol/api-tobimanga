import { Genre } from '../entities/genre.entity'

export interface GenreRepository {
  findAll(): Promise<Genre[]>
  findById(id: string): Promise<Genre | null>
  findByName(name: string): Promise<Genre | null>
  save(genre: Genre): Promise<Genre>
}
