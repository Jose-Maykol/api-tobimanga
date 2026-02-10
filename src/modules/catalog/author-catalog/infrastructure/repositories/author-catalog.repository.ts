import { Inject, Injectable } from '@nestjs/common'

import { DATABASE_SERVICE } from '@/core/database/constants/database.constants'
import { DatabaseService } from '@/core/database/services/database.service'

import { ListAuthorDto } from '../../application/dtos/list-author.dto'

@Injectable()
export class AuthorCatalogRepository {
  constructor(
    @Inject(DATABASE_SERVICE)
    private readonly db: DatabaseService,
  ) {}

  async findAll(): Promise<ListAuthorDto[]> {
    const results = await this.db.client.query.authors.findMany({
      columns: {
        id: true,
        name: true,
      },
    })

    return results
  }
}
