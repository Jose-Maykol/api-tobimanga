import { Injectable } from '@nestjs/common'
import { MangaRepository } from '../../domain/repositories/manga.repository'
import { DrizzleService } from '@/modules/database/services/drizzle.service'
import { mangas } from '@/modules/database/schemas/manga.schema'
import {
  count,
  desc,
  eq,
  ExtractTablesWithRelations,
  InferInsertModel,
  sql,
} from 'drizzle-orm'
import { Manga } from '../../domain/entities/manga.entity'
import { MangaMapper } from '../mappers/manga.mapper'
import { PgTransaction } from 'drizzle-orm/pg-core'
import { databaseSchema } from '@/modules/database/schemas'
import {
  NodePgQueryResultHKT,
  NodePgTransaction,
} from 'drizzle-orm/node-postgres'
import { mangaAuthors } from '@/modules/database/schemas/manga-author.schema'
import { mangaGenres } from '@/modules/database/schemas/manga-genre.schema'
import { chapters } from '@/modules/database/schemas/chapter.schema'
import { demographics } from '@/modules/database/schemas/demographic.schema'
import { authors } from '@/modules/database/schemas/author.schema'
import { genres } from '@/modules/database/schemas/genres.schema'
import MangaRecord from '../../domain/types/manga'
import { DeepPartial } from '@/modules/v1/shared/types/deep-partial'
import ChapterRecord from '../../domain/types/chapter'

@Injectable()
export class MangaRepositoryImpl implements MangaRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findPaginated(
    page: number,
    limit: number,
  ): Promise<[DeepPartial<MangaRecord[]>, { count: number }]> {
    const offset = (page - 1) * limit
    const paginatedMangas = await this.drizzle.db
      .select()
      .from(mangas)
      .offset(offset)
      .limit(limit)
    const totalMangas = await this.drizzle.db
      .select({ count: count() })
      .from(mangas)
    return [
      paginatedMangas.map((manga) => ({
        id: manga.id,
        originalName: manga.originalName,
        slugName: manga.slugName ?? undefined,
        chapters: manga.chapters,
        rating: manga.rating,
        coverImage: manga.coverImage ?? undefined,
      })),

      {
        count: totalMangas[0].count,
      },
    ]
  }

  async findPaginatedChaptersByMangaTitle(
    title: string,
    page: number,
    limit: number,
  ): Promise<[DeepPartial<ChapterRecord[]>, { count: number }]> {
    const offset = (page - 1) * limit
    const paginatedChapters = await this.drizzle.db
      .select({
        id: chapters.id,
        chapterNumber: chapters.chapterNumber,
      })
      .from(chapters)
      .innerJoin(mangas, eq(chapters.mangaId, mangas.id))
      .where(
        eq(
          sql<string>`lower(${mangas.originalName})`,
          sql<string>`lower(${title})`,
        ),
      )
      .orderBy(desc(chapters.chapterNumber))
      .offset(offset)
      .limit(limit)
    const totalChapters = await this.drizzle.db
      .select({ count: count() })
      .from(chapters)
      .innerJoin(mangas, eq(chapters.mangaId, mangas.id))
      .where(
        eq(
          sql<string>`lower(${mangas.originalName})`,
          sql<string>`lower(${title})`,
        ),
      )
    return [
      paginatedChapters,
      {
        count: totalChapters[0].count,
      },
    ]
  }

  async findOneByTitle(
    title: string,
  ): Promise<DeepPartial<MangaRecord> | null> {
    const manga = await this.drizzle.db
      .select({
        id: mangas.id,
        originalName: mangas.originalName,
        slugName: mangas.slugName,
        alternativeNames: mangas.alternativeNames,
        sinopsis: mangas.sinopsis,
        chapters: mangas.chapters,
        releaseDate: mangas.releaseDate,
        publicationStatus: mangas.publicationStatus,
        coverImage: mangas.coverImage,
        bannerImage: mangas.bannerImage,
        demographic: {
          id: demographics.id,
          name: demographics.name,
        },
      })
      .from(mangas)
      .innerJoin(demographics, eq(mangas.demographicId, demographics.id))
      .where(
        eq(
          sql<string>`lower(${mangas.originalName})`,
          sql<string>`lower(${title})`,
        ),
      )
      .limit(1)

    if (manga.length === 0) {
      return null
    }

    const allAnimeAuthors = await this.drizzle.db
      .select({
        id: authors.id,
        name: authors.name,
      })
      .from(mangaAuthors)
      .innerJoin(authors, eq(mangaAuthors.authorId, authors.id))
      .where(eq(mangaAuthors.mangaId, manga[0].id))
    const allAnimeGenres = await this.drizzle.db
      .select({
        id: genres.id,
        name: genres.name,
      })
      .from(mangaGenres)
      .innerJoin(genres, eq(mangaGenres.genreId, genres.id))
      .where(eq(mangaGenres.mangaId, manga[0].id))
    return {
      id: manga[0].id,
      originalName: manga[0].originalName,
      slugName: manga[0].slugName ?? undefined,
      alternativeNames: manga[0].alternativeNames,
      sinopsis: manga[0].sinopsis,
      chapters: manga[0].chapters,
      releaseDate: manga[0].releaseDate
        ? new Date(manga[0].releaseDate)
        : undefined,
      publicationStatus: manga[0].publicationStatus,
      coverImage: manga[0].coverImage ?? undefined,
      bannerImage: manga[0].bannerImage ?? undefined,
      demographic: {
        id: manga[0].demographic.id,
        name: manga[0].demographic.name,
      },
      authors: allAnimeAuthors,
      genres: allAnimeGenres,
    }
  }

  async existsByTitle(title: string): Promise<boolean> {
    const manga = await this.drizzle.db
      .select({
        exists: sql`1`,
      })
      .from(mangas)
      .where(eq(mangas.originalName, title))
      .limit(1)
    return manga.length > 0
  }

  async existsById(id: string): Promise<boolean> {
    const manga = await this.drizzle.db
      .select({
        exists: sql`1`,
      })
      .from(mangas)
      .where(eq(mangas.id, id))
      .limit(1)
    return manga.length > 0
  }

  async save(mangaEntity: Manga): Promise<Manga> {
    const mangaPersistence = MangaMapper.toPersistence(mangaEntity)
    const { authors, genres, manga } = mangaPersistence
    const newManga = await this.drizzle.db.transaction(async (tx) => {
      const insertedManga = await this.saveManga(manga, tx)
      const { id: mangaId, chapters } = insertedManga
      await this.saveAuthors(authors, mangaId, tx)
      await this.saveGenres(genres, mangaId, tx)
      await this.saveChapters(chapters, mangaId, tx)
      return {
        ...insertedManga[0],
        authors: authors.map((author) => ({ id: author })),
        genres: genres.map((genre) => ({ id: genre })),
      }
    })

    return MangaMapper.toDomain(newManga)
  }

  async saveManga(
    manga: InferInsertModel<typeof mangas>,
    tx: NodePgTransaction<
      typeof databaseSchema,
      ExtractTablesWithRelations<typeof databaseSchema>
    >,
  ): Promise<any> {
    const insertedManga = await tx.insert(mangas).values(manga).returning()
    return insertedManga[0]
  }

  async saveAuthors(
    authorsList: InferInsertModel<typeof authors>[],
    mangaId: string,
    transaction: PgTransaction<
      NodePgQueryResultHKT,
      typeof databaseSchema,
      ExtractTablesWithRelations<typeof databaseSchema>
    >,
  ): Promise<void> {
    const mappedAuthorsList = authorsList
      .filter((author) => author.id !== undefined)
      .map((author) => ({
        mangaId: mangaId,
        authorId: author.id as string,
      }))
    await transaction.insert(mangaAuthors).values(mappedAuthorsList)
  }

  async saveGenres(
    genresList: InferInsertModel<typeof genres>[],
    mangaId: string,
    transaction: PgTransaction<
      NodePgQueryResultHKT,
      typeof databaseSchema,
      ExtractTablesWithRelations<typeof databaseSchema>
    >,
  ): Promise<void> {
    const mappedGenresList = genresList.map((genre) => ({
      mangaId: mangaId,
      genreId: genre.id,
    }))
    await transaction.insert(mangaGenres).values(mappedGenresList)
  }

  async saveChapters(
    numberChapters: number,
    mangaId: string,
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
      mangaId: mangaId,
    }))
    await transaction.insert(chapters).values(listChapters)
  }
}
