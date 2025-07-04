import { DATABASE_SERVICE } from '@/core/database/constants/database.constants'
import { DatabaseService } from '@/core/database/services/database.service'
import { Inject, Injectable } from '@nestjs/common'
import { GenreRepository } from '../../domain/repositories/genre.repository'
import { Genre } from '../../domain/entities/genre.entity'
import { desc, eq } from 'drizzle-orm'
import { genres } from '@/core/database/schemas/genres.schema'

@Injectable()
export class GenreRepositoryImpl implements GenreRepository {
  constructor(
    @Inject(DATABASE_SERVICE)
    private readonly db: DatabaseService,
  ) {}

  async findAll(): Promise<Genre[]> {
    const genreList = await this.db.query
      .select()
      .from(genres)
      .orderBy(desc(genres.name))

    return genreList as Genre[]
  }

  async findById(id: string): Promise<Genre | null> {
    const genre = await this.db.query
      .select()
      .from(genres)
      .where(eq(genres.id, id))
      .limit(1)

    return genre ? (genre[0] as Genre) : null
  }

  async findByName(name: string): Promise<Genre | null> {
    const genre = await this.db.query
      .select()
      .from(genres)
      .where(eq(genres.name, name))
      .limit(1)

    return genre ? (genre[0] as Genre) : null
  }

  async save(genre: Genre): Promise<Genre> {
    const savedGenre = await this.db.query
      .insert(genres)
      .values(genre)
      .returning()

    return savedGenre[0] as Genre
  }
}
