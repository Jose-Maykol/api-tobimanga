import { Author } from '../entities/author.entity'

export interface AuthorRepository {
  existsById(id: string): Promise<boolean>
  existsByName(name: string): Promise<boolean>
  findAll(): Promise<Author[] | null>
  findById(id: string): Promise<Author | null>
  findByIds(ids: string[]): Promise<Author[] | null>
  findByName(name: string): Promise<Author | null>
  save(author: Author): Promise<Author>
}
