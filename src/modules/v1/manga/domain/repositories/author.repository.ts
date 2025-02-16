import { Author } from '../entities/author.entity'

export interface AuthorRepository {
  findAll(): Promise<Author[] | null>
  findById(id: string): Promise<Author | null>
  findByIds(ids: string[]): Promise<Author[] | null>
  findByName(name: string): Promise<Author | null>
  save(author: Author): Promise<Author>
}
