import { Inject, Injectable } from '@nestjs/common'

import { DemographicNotFoundException } from '@/core/domain/exceptions/demographic/demographic-not-found.exception'
import { DEMOGRAPHIC_REPOSITORY } from '@/infrastructure/tokens/repositories'

import { Demographic } from '../../../../../core/domain/entities/demographic.entity'
import { DemographicRepository } from '../../../../../core/domain/repositories/demographic.repository'

@Injectable()
export class GetDemographicByIdUseCase {
  constructor(
    @Inject(DEMOGRAPHIC_REPOSITORY)
    private readonly demographicRepository: DemographicRepository,
  ) {}

  async execute(id: string): Promise<Demographic> {
    const demographic = await this.demographicRepository.findById(id)
    if (!demographic) {
      throw new DemographicNotFoundException(id)
    }
    return demographic
  }
}
