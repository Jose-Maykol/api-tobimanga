import { desc, eq, inArray } from 'drizzle-orm'

import { Inject, Injectable } from '@nestjs/common'

import { DATABASE_SERVICE } from '@/core/database/constants/database.constants'
import { authors } from '@/core/database/schemas/author.schema'
import { DatabaseService } from '@/core/database/services/database.service'
import { AuthorRepository } from '@/core/domain/repositories/author.repository'

import { Author } from '../../../../core/domain/entities/author.entity'

@Injectable()
export class AuthorRepositoryImpl implements AuthorRepository {
  constructor(
    @Inject(DATABASE_SERVICE)
    private readonly db: DatabaseService,
  ) {}

  async findAll(): Promise<Author[]> {
    const authorList = await this.db.client
      .select()
      .from(authors)
      .orderBy(desc(authors.name))

    return authorList as Author[]
  }

  async findById(id: string): Promise<Author | null> {
    const author = await this.db.client
      .select()
      .from(authors)
      .where(eq(authors.id, id))
      .limit(1)

    return author ? (author[0] as Author) : null
  }

  async findByIds(ids: string[]): Promise<Author[]> {
    const authorList = await this.db.client
      .select()
      .from(authors)
      .where(inArray(authors.id, ids))
      .orderBy(desc(authors.name))

    return authorList as Author[]
  }

  async findByName(name: string): Promise<Author | null> {
    const author = await this.db.client
      .select()
      .from(authors)
      .where(eq(authors.name, name))
      .limit(1)
    return author ? (author[0] as Author) : null
  }

  async save(author: Author): Promise<Author> {
    const savedAuthor = await this.db.client
      .insert(authors)
      .values(author)
      .returning()

    return savedAuthor[0] as Author
  }
}
