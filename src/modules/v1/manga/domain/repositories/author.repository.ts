import { Author } from '../entities/author.entity'

export interface AuthorRepository {
  find(): Promise<any[]>
  findById(id: string): Promise<any>
  findByIds(ids: string[]): Promise<any[]>
  exists(name: string): Promise<boolean>
  save(author: Author): Promise<{ id: string }>
}
