import { desc, eq, inArray } from 'drizzle-orm'

import { Inject, Injectable } from '@nestjs/common'

import { DATABASE_SERVICE } from '@/core/database/constants/database.constants'
import { genres } from '@/core/database/schemas/genres.schema'
import { DatabaseService } from '@/core/database/services/database.service'
import { GenreRepository } from '@/core/domain/repositories/genre.repository'

import { Genre } from '../../../../core/domain/entities/genre.entity'

@Injectable()
export class GenreRepositoryImpl implements GenreRepository {
  constructor(
    @Inject(DATABASE_SERVICE)
    private readonly db: DatabaseService,
  ) {}

  async findAll(): Promise<Genre[]> {
    const genreList = await this.db.client
      .select()
      .from(genres)
      .orderBy(desc(genres.name))

    return genreList as Genre[]
  }

  async findById(id: string): Promise<Genre | null> {
    const genre = await this.db.client
      .select()
      .from(genres)
      .where(eq(genres.id, id))
      .limit(1)

    return genre ? (genre[0] as Genre) : null
  }

  async findByIds(ids: string[]): Promise<Genre[]> {
    const genreList = await this.db.client
      .select()
      .from(genres)
      .where(inArray(genres.id, ids))
      .orderBy(desc(genres.name))

    return genreList as Genre[]
  }

  async findByName(name: string): Promise<Genre | null> {
    const genre = await this.db.client
      .select()
      .from(genres)
      .where(eq(genres.name, name))
      .limit(1)

    return genre ? (genre[0] as Genre) : null
  }

  async save(genre: Genre): Promise<Genre> {
    const savedGenre = await this.db.client
      .insert(genres)
      .values(genre)
      .returning()

    return savedGenre[0] as Genre
  }
}
