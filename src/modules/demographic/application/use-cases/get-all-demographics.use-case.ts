import { Inject, Injectable } from '@nestjs/common'

import { Demographic } from '../../../../core/domain/entities/demographic.entity'
import { DemographicRepository } from '../../../../core/domain/repositories/demographic.repository'

@Injectable()
export class GetAllDemographicsUseCase {
  constructor(
    @Inject('DemographicRepository')
    private readonly demographicRepository: DemographicRepository,
  ) {}

  async execute(): Promise<Demographic[]> {
    const demographics = await this.demographicRepository.findAll()
    return demographics
  }
}
