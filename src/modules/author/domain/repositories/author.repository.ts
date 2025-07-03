import { Author } from '../entities/author.entity'

export interface AuthorRepository {
  findAll(): Promise<Author[]>
  findById(id: string): Promise<Author | null>
  findByIds(ids: string[]): Promise<Author[]>
  findByName(name: string): Promise<Author | null>
  save(author: Author): Promise<Author>
}
