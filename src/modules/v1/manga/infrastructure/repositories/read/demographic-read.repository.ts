import { DrizzleService } from '@/modules/database/services/drizzle.service'
import { Injectable } from '@nestjs/common'
import { DemographicListDto } from '../../../application/dto/demographic.dto'
import { demographics } from '@/modules/database/schemas/demographic.schema'

@Injectable()
export class DemographicReadRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async findAll(): Promise<DemographicListDto[]> {
    const allDemographics = await this.drizzle.db
      .select({
        id: demographics.id,
        name: demographics.name,
      })
      .from(demographics)
    return allDemographics
  }
}
