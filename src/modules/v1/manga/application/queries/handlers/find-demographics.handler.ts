import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { FindDemographicsQuery } from '../find-demographics.query'
import { DemographicReadRepository } from '../../../infrastructure/repositories/read/demographic-read.repository'
@QueryHandler(FindDemographicsQuery)
export class FindDemographicsHandler
  implements IQueryHandler<FindDemographicsQuery>
{
  constructor(
    private readonly demographicRepository: DemographicReadRepository,
  ) {}

  async execute() {
    const demographics = await this.demographicRepository.findAll()

    return {
      demographics,
    }
  }
}
