import { PgTransaction } from 'drizzle-orm/pg-core'
import { Manga } from '../entities/manga.entity'
import { NodePgQueryResultHKT } from 'drizzle-orm/node-postgres'
import { databaseSchema } from '@/modules/database/schemas'
import { ExtractTablesWithRelations } from 'drizzle-orm'

export interface MangaRepository {
  findPaginatedMangas(page: number, limit: number): Promise<any>
  existsManga(title: string): Promise<boolean>
  saveManga(
    manga: Manga,
    transaction: PgTransaction<
      NodePgQueryResultHKT,
      typeof databaseSchema,
      ExtractTablesWithRelations<typeof databaseSchema>
    >,
  ): Promise<{ id: string }>
}
