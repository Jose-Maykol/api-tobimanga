import { Inject, Injectable } from '@nestjs/common'
import { DemographicRepository } from '../../../../core/domain/repositories/demographic.repository'
import { DATABASE_SERVICE } from '@/core/database/constants/database.constants'
import { DatabaseService } from '@/core/database/services/database.service'
import { Demographic } from '../../../../core/domain/entities/demographic.entity'
import { demographics } from '@/core/database/schemas/demographic.schema'
import { desc, eq } from 'drizzle-orm'

@Injectable()
export class DemographicRepositoryImpl implements DemographicRepository {
  constructor(
    @Inject(DATABASE_SERVICE)
    private readonly db: DatabaseService,
  ) {}

  async findAll(): Promise<Demographic[]> {
    const demographicList = await this.db.client
      .select()
      .from(demographics)
      .orderBy(desc(demographics.name))

    return demographicList as Demographic[]
  }

  async findById(id: string): Promise<Demographic | null> {
    const demographic = await this.db.client
      .select()
      .from(demographics)
      .where(eq(demographics.id, id))
      .limit(1)

    return demographic ? (demographic[0] as Demographic) : null
  }
}
