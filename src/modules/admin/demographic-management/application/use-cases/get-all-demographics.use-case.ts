import { Inject, Injectable, Logger } from '@nestjs/common'

import { DEMOGRAPHIC_REPOSITORY } from '@/infrastructure/tokens/repositories'

import { Demographic } from '../../../../../core/domain/entities/demographic.entity'
import { DemographicRepository } from '../../../../../core/domain/repositories/demographic.repository'

@Injectable()
export class GetAllDemographicsUseCase {
  private readonly logger = new Logger(GetAllDemographicsUseCase.name)

  constructor(
    @Inject(DEMOGRAPHIC_REPOSITORY)
    private readonly demographicRepository: DemographicRepository,
  ) {}

  async execute(): Promise<Demographic[]> {
    const demographics = await this.demographicRepository.findAll()
    this.logger.log(`Retrieved ${demographics.length} demographics`)
    return demographics
  }
}
