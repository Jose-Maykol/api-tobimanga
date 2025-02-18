import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { FindDemographicsQuery } from '../find-demographics.query'
import { Inject } from '@nestjs/common'
import { DemographicRepository } from '../../../domain/repositories/demographic.repository'
import { DemographicNotFoundException } from '../../exceptions/demographic-not-found.exception'

@QueryHandler(FindDemographicsQuery)
export class FindDemographicsHandler
  implements IQueryHandler<FindDemographicsQuery>
{
  constructor(
    @Inject('DemographicRepository')
    private readonly demographicRepository: DemographicRepository,
  ) {}

  async execute() {
    const demographics = await this.demographicRepository.findAll()

    if (!demographics) {
      throw new DemographicNotFoundException()
    }

    return {
      demographics,
    }
  }
}
