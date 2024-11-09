import { PgTransaction } from 'drizzle-orm/pg-core'
import { Manga } from '../entities/manga.entity'
import { NodePgQueryResultHKT } from 'drizzle-orm/node-postgres'
import { databaseSchema } from '@/modules/database/schemas'
import { ExtractTablesWithRelations } from 'drizzle-orm'

export interface MangaRepository {
  findPaginated(page: number, limit: number): Promise<any>
  exists(title: string): Promise<boolean>
  save(
    manga: Manga,
    transaction: PgTransaction<
      NodePgQueryResultHKT,
      typeof databaseSchema,
      ExtractTablesWithRelations<typeof databaseSchema>
    >,
  ): Promise<{ id: string }>
  saveAuthors(
    authors: string[],
    manga: string,
    transaction: PgTransaction<
      NodePgQueryResultHKT,
      typeof databaseSchema,
      ExtractTablesWithRelations<typeof databaseSchema>
    >,
  ): Promise<void>
  saveGenres(
    genres: string[],
    manga: string,
    transaction: PgTransaction<
      NodePgQueryResultHKT,
      typeof databaseSchema,
      ExtractTablesWithRelations<typeof databaseSchema>
    >,
  ): Promise<void>
  saveChapters(
    numberChapters: number,
    manga: string,
    transaction: PgTransaction<
      NodePgQueryResultHKT,
      typeof databaseSchema,
      ExtractTablesWithRelations<typeof databaseSchema>
    >,
  ): Promise<void>
}
