import { Injectable } from '@nestjs/common'
import { GenreRepository } from '../../domain/repositories/genre.repository'
import { DrizzleService } from '@/modules/database/services/drizzle.service'
import { genres } from '@/modules/database/schemas/genres.schema'
import { eq, inArray } from 'drizzle-orm'
import { Genre } from '../../domain/entities/genre.entity'
import { GenreMapper } from '../mappers/genre.mapper'

@Injectable()
export class GenreRepositoryImpl implements GenreRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async find(): Promise<Genre[] | null> {
    const allGenres = await this.drizzle.db.select().from(genres)
    if (allGenres.length === 0) return null
    return allGenres.map((genre) => GenreMapper.toDomain(genre))
  }

  async findById(id: string): Promise<Genre | null> {
    const genre = await this.drizzle.db
      .select()
      .from(genres)
      .where(eq(genres.id, id))
    if (genre.length === 0) return null
    return GenreMapper.toDomain(genre[0])
  }

  async findByIds(ids: string[]): Promise<Genre[] | null> {
    const listGenres = await this.drizzle.db
      .select()
      .from(genres)
      .where(inArray(genres.id, ids))
    if (listGenres.length === 0) return null
    return listGenres.map((genre) => GenreMapper.toDomain(genre))
  }

  async findByName(name: string): Promise<Genre | null> {
    const genre = await this.drizzle.db
      .select()
      .from(genres)
      .where(eq(genres.name, name))
    if (genre.length === 0) return null
    return GenreMapper.toDomain(genre[0])
  }

  async save(genre: Genre): Promise<Genre> {
    const persistenceGenre = GenreMapper.toPersistence(genre)
    const insertedGenre = await this.drizzle.db
      .insert(genres)
      .values(persistenceGenre)
      .returning()
    const { id, name, createdAt, updatedAt } = insertedGenre[0]
    return GenreMapper.toDomain({
      id,
      name,
      createdAt,
      updatedAt,
    })
  }
}
