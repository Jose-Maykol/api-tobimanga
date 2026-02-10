import { Inject, Injectable } from '@nestjs/common'

import { DATABASE_SERVICE } from '@/core/database/constants/database.constants'
import { DatabaseService } from '@/core/database/services/database.service'

import { ListDemographicDto } from '../../application/dtos/list-demographic.dto'

@Injectable()
export class DemographicCatalogRepository {
  constructor(
    @Inject(DATABASE_SERVICE)
    private readonly db: DatabaseService,
  ) {}

  async findAll(): Promise<ListDemographicDto[]> {
    const results = await this.db.client.query.demographics.findMany({
      columns: {
        id: true,
        name: true,
      },
    })

    return results
  }
}
