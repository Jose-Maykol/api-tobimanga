import { Genre } from '../entities/genre.entity'

export interface GenreRepository {
  find(): Promise<any[]>
  findById(id: string): Promise<any>
  findByIds(ids: string[]): Promise<any[]>
  exists(name: string): Promise<boolean>
  save(genre: Genre): Promise<{ id: string }>
}
