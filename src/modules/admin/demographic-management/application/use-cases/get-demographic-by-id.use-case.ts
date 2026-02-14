import { Inject, Injectable, Logger } from '@nestjs/common'

import { DemographicNotFoundException } from '@/modules/admin/demographic-management/domain/exceptions/demographic-not-found.exception'

import { Demographic } from '../../domain/entities/demographic.entity'
import { DemographicRepository } from '../../domain/repositories/demographic.repository'
import { DEMOGRAPHIC_REPOSITORY } from '../../domain/tokens'

@Injectable()
export class GetDemographicByIdUseCase {
  private readonly logger = new Logger(GetDemographicByIdUseCase.name)

  constructor(
    @Inject(DEMOGRAPHIC_REPOSITORY)
    private readonly demographicRepository: DemographicRepository,
  ) {}

  async execute(id: string): Promise<Demographic> {
    const demographic = await this.demographicRepository.findById(id)
    if (!demographic) {
      this.logger.warn(`Demographic not found with ID ${id}`)
      throw new DemographicNotFoundException(id)
    }
    return demographic
  }
}
