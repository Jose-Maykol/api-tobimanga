import { Injectable } from '@nestjs/common'
import { GenreRepository } from '../../domain/repositories/genre.repository'
import { DrizzleService } from '@/modules/database/services/drizzle.service'
import { genres } from '@/modules/database/schemas/genres.schema'
import { eq, inArray } from 'drizzle-orm'

@Injectable()
export class GenreRepositoryImpl implements GenreRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findById(id: string): Promise<any> {
    const genre = await this.drizzle.db
      .select()
      .from(genres)
      .where(eq(genres.genreId, id))
    return genre[0]
  }

  async findByIds(ids: string[]): Promise<any[]> {
    const listGenres = await this.drizzle.db
      .select()
      .from(genres)
      .where(inArray(genres.genreId, ids))
    return listGenres
  }

  async exists(name: string): Promise<boolean> {
    const genre = await this.drizzle.db
      .select()
      .from(genres)
      .where(eq(genres.name, name))
    return genre.length > 0
  }

  async save(name: string): Promise<{ id: string }> {
    const insertedGenre = await this.drizzle.db
      .insert(genres)
      .values({
        name,
      })
      .returning({
        id: genres.genreId,
      })

    return {
      id: insertedGenre[0].id,
    }
  }
}