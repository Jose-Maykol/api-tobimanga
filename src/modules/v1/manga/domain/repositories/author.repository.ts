import { Author } from '../entities/author.entity'

export interface AuthorRepository {
  findAll(): Promise<Author[]>
  findById(id: string): Promise<Author>
  findByIds(ids: string[]): Promise<Author[]>
  findByName(name: string): Promise<Author>
  save(author: Author): Promise<Author>
}
