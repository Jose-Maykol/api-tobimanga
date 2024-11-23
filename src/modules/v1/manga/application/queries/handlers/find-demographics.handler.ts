import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { FindDemographicsQuery } from '../find-demographics.query'
import { Inject, NotFoundException } from '@nestjs/common'
import { DemographicRepository } from '../../../domain/repositories/demographic.repository'

@QueryHandler(FindDemographicsQuery)
export class FindDemographicsHandler
  implements IQueryHandler<FindDemographicsQuery>
{
  constructor(
    @Inject('DemographicRepository')
    private readonly demographicRepository: DemographicRepository,
  ) {}

  async execute() {
    const demographics = await this.demographicRepository.find()

    if (demographics.length === 0) {
      throw new NotFoundException('No se encontraron demograficos')
    }

    return {
      demographics,
    }
  }
}
