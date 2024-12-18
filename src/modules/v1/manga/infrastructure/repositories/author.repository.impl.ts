import { DrizzleService } from '@/modules/database/services/drizzle.service'
import { Injectable } from '@nestjs/common'
import { AuthorRepository } from '../../domain/repositories/author.repository'
import { authors } from '@/modules/database/schemas/author.schema'
import { eq, inArray } from 'drizzle-orm'
import { Author } from '../../domain/entities/author.entity'

@Injectable()
export class AuthorRepositoryImpl implements AuthorRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async find(): Promise<any[]> {
    const allAuthors = await this.drizzle.db.select().from(authors)
    return allAuthors
  }

  async findById(id: string): Promise<any> {
    const author = await this.drizzle.db
      .select()
      .from(authors)
      .where(eq(authors.id, id))

    return author[0]
  }

  async findByIds(ids: string[]): Promise<any[]> {
    const listAuthors = await this.drizzle.db
      .select()
      .from(authors)
      .where(inArray(authors.id, ids))

    return listAuthors
  }

  async exists(name: string): Promise<boolean> {
    const author = await this.drizzle.db
      .select()
      .from(authors)
      .where(eq(authors.name, name))
    return author.length > 0
  }

  async save(author: Author): Promise<{ id: string }> {
    const name = author.getName()
    const insertedAuthor = await this.drizzle.db
      .insert(authors)
      .values({
        name,
      })
      .returning({
        id: authors.id,
      })

    return {
      id: insertedAuthor[0].id,
    }
  }
}
