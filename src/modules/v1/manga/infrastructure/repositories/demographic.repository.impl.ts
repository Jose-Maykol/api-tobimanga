import { Injectable } from '@nestjs/common'
import { DemographicRepository } from '../../domain/repositories/demographic.repository'
import { DrizzleService } from '@/modules/database/services/drizzle.service'
import { demographics } from '@/modules/database/schemas/demographic.schema'
import { eq } from 'drizzle-orm'

@Injectable()
export class DemographicRepositoryImpl implements DemographicRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findById(id: string): Promise<any> {
    const demographic = await this.drizzle.db
      .select()
      .from(demographics)
      .where(eq(demographics.demographicId, id))
    return demographic[0]
  }

  async exists(name: string): Promise<boolean> {
    const demographic = await this.drizzle.db
      .select()
      .from(demographics)
      .where(eq(demographics.name, name))

    return demographic.length > 0
  }

  async save(name: string): Promise<{ id: string }> {
    const insertedDemographic = await this.drizzle.db
      .insert(demographics)
      .values({
        name,
      })
      .returning({
        id: demographics.demographicId,
      })

    return {
      id: insertedDemographic[0].id,
    }
  }
}
