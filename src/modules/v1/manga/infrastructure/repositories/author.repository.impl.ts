import { DrizzleService } from '@/modules/database/services/drizzle.service'
import { Injectable } from '@nestjs/common'
import { AuthorRepository } from '../../domain/repositories/author.repository'
import { authors } from '@/modules/database/schemas/author.schema'
import { eq, inArray, sql } from 'drizzle-orm'
import { Author } from '../../domain/entities/author.entity'
import { AuthorMapper } from '../mappers/author.mapper'

@Injectable()
export class AuthorRepositoryImpl implements AuthorRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async existsById(id: string): Promise<boolean> {
    const author = await this.drizzle.db
      .select({
        exists: sql`1`,
      })
      .from(authors)
      .where(eq(authors.id, id))
    return author.length > 0
  }

  async existsByName(name: string): Promise<boolean> {
    const author = await this.drizzle.db
      .select({
        exists: sql`1`,
      })
      .from(authors)
      .where(eq(authors.name, name))
    return author.length > 0
  }

  async findAll(): Promise<Author[] | null> {
    const allAuthors = await this.drizzle.db.select().from(authors)
    if (allAuthors.length === 0) return null
    return allAuthors.map((author) => AuthorMapper.toDomain(author))
  }

  async findById(id: string): Promise<Author | null> {
    const author = await this.drizzle.db
      .select()
      .from(authors)
      .where(eq(authors.id, id))
    if (author.length === 0) return null
    return AuthorMapper.toDomain(author[0])
  }

  async findByIds(ids: string[]): Promise<Author[] | null> {
    const listAuthors = await this.drizzle.db
      .select()
      .from(authors)
      .where(inArray(authors.id, ids))
    if (listAuthors.length === 0) return []
    return listAuthors.map((author) => AuthorMapper.toDomain(author))
  }

  async findByName(name: string): Promise<Author | null> {
    const author = await this.drizzle.db
      .select()
      .from(authors)
      .where(eq(authors.name, name))
    if (author.length === 0) return null
    return AuthorMapper.toDomain(author[0])
  }

  async save(author: Author): Promise<Author> {
    const persistenceAuthor = AuthorMapper.toPersistence(author)
    const savedAuthor = await this.drizzle.db
      .insert(authors)
      .values(persistenceAuthor)
      .returning()
    const { id, name, createdAt, updatedAt } = savedAuthor[0]
    return AuthorMapper.toDomain({ id, name, createdAt, updatedAt })
  }
}
