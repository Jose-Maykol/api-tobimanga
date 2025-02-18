import { Injectable } from '@nestjs/common'
import { DemographicRepository } from '../../domain/repositories/demographic.repository'
import { DrizzleService } from '@/modules/database/services/drizzle.service'
import { demographics } from '@/modules/database/schemas/demographic.schema'
import { eq } from 'drizzle-orm'
import { Demographic } from '../../domain/entities/demographic.entity'
import { DemographicMapper } from '../mappers/demographic.mapper'

@Injectable()
export class DemographicRepositoryImpl implements DemographicRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findAll(): Promise<Demographic[] | null> {
    const allDemographics = await this.drizzle.db.select().from(demographics)
    if (allDemographics.length === 0) return null
    return allDemographics.map((demographic) =>
      DemographicMapper.toDomain(demographic),
    )
  }

  async findById(id: string): Promise<Demographic | null> {
    const demographic = await this.drizzle.db
      .select()
      .from(demographics)
      .where(eq(demographics.id, id))
    if (demographic.length === 0) return null
    return DemographicMapper.toDomain(demographic[0])
  }

  async save(demographic: Demographic): Promise<Demographic> {
    const persistenceDemographic = DemographicMapper.toPersistence(demographic)
    const insertedDemographic = await this.drizzle.db
      .insert(demographics)
      .values(persistenceDemographic)
      .returning()

    return DemographicMapper.toDomain(insertedDemographic[0])
  }
}
