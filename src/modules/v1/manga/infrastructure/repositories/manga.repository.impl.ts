import { Injectable } from '@nestjs/common'
import { MangaRepository } from '../../domain/repositories/manga.repository'
import { DrizzleService } from '@/modules/database/services/drizzle.service'
import { mangas } from '@/modules/database/schemas/manga.schema'
import { count, eq, ExtractTablesWithRelations } from 'drizzle-orm'
import { Manga } from '../../domain/entities/manga.entity'
import { MangaMapper } from '../mappers/manga.mapper'
import { PgTransaction } from 'drizzle-orm/pg-core'
import { databaseSchema } from '@/modules/database/schemas'
import { NodePgQueryResultHKT } from 'drizzle-orm/node-postgres'
import { mangaAuthors } from '@/modules/database/schemas/manga-author.schema'
import { mangaGenres } from '@/modules/database/schemas/manga-genre.schema'
import { chapters } from '@/modules/database/schemas/chapter.schema'

@Injectable()
export class MangaRepositoryImpl implements MangaRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findPaginated(page: number, limit: number): Promise<any> {
    const offset = (page - 1) * limit
    const paginatedMangas = await this.drizzle.db
      .select()
      .from(mangas)
      .offset(offset)
      .limit(limit)
    const totalMangas = await this.drizzle.db
      .select({ count: count() })
      .from(mangas)
    return [paginatedMangas, totalMangas]
  }

  async exists(title: string): Promise<boolean> {
    const manga = await this.drizzle.db
      .select()
      .from(mangas)
      .where(eq(mangas.originalName, title))
    return manga.length > 0
  }

  async save(
    manga: Manga,
    transaction: PgTransaction<
      NodePgQueryResultHKT,
      typeof databaseSchema,
      ExtractTablesWithRelations<typeof databaseSchema>
    >,
  ): Promise<{ id: string }> {
    const mangaPersistence = MangaMapper.toPersistence(manga)
    const insertedManga = await transaction
      .insert(mangas)
      .values({
        originalName: mangaPersistence.originalName,
        alternativeNames: mangaPersistence.alternativeNames,
        sinopsis: mangaPersistence.sinopsis,
        chapters: mangaPersistence.chapters,
        releaseDate: mangaPersistence.releaseDate,
        publicationStatus: mangaPersistence.publicationStatus,
        coverImage: mangaPersistence.coverImage,
        bannerImage: mangaPersistence.bannerImage,
        demographicId: mangaPersistence.demographic,
      })
      .returning({
        id: mangas.id,
      })

    return {
      id: insertedManga[0].id,
    }
  }

  async saveAuthors(
    authors: string[],
    manga: string,
    transaction: PgTransaction<
      NodePgQueryResultHKT,
      typeof databaseSchema,
      ExtractTablesWithRelations<typeof databaseSchema>
    >,
  ): Promise<void> {
    await transaction
      .insert(mangaAuthors)
      .values(authors.map((author) => ({ authorId: author, mangaId: manga })))
  }

  async saveGenres(
    genres: string[],
    manga: string,
    transaction: PgTransaction<
      NodePgQueryResultHKT,
      typeof databaseSchema,
      ExtractTablesWithRelations<typeof databaseSchema>
    >,
  ): Promise<void> {
    await transaction
      .insert(mangaGenres)
      .values(genres.map((genre) => ({ genreId: genre, mangaId: manga })))
  }

  async saveChapters(
    numberChapters: number,
    manga: string,
    transaction: PgTransaction<
      NodePgQueryResultHKT,
      typeof databaseSchema,
      ExtractTablesWithRelations<typeof databaseSchema>
    >,
  ): Promise<void> {
    const listChapters = Array.from(
      { length: numberChapters },
      (_, i) => i + 1,
    ).map((chapter) => ({
      chapterNumber: chapter,
      mangaId: manga,
    }))
    await transaction.insert(chapters).values(listChapters)
  }
}
