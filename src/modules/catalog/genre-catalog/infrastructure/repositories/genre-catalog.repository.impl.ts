import { Inject, Injectable } from '@nestjs/common'

import { DATABASE_SERVICE } from '@/core/database/constants/database.constants'
import { DatabaseService } from '@/core/database/services/database.service'

import { ListGenreDto } from '../../application/dtos/list-genre.dto'
import { IGenreCatalogRepository } from '../../domain/repositories/genre-catalog.repository'

@Injectable()
export class GenreCatalogRepositoryImpl implements IGenreCatalogRepository {
  constructor(
    @Inject(DATABASE_SERVICE)
    private readonly db: DatabaseService,
  ) {}

  async findAll(): Promise<ListGenreDto[]> {
    const results = await this.db.client.query.genres.findMany({
      columns: {
        id: true,
        name: true,
      },
    })

    return results
  }
}
