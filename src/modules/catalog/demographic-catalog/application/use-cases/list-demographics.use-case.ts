import { Inject, Injectable } from '@nestjs/common'

import { DemographicCatalogRepository } from '../../infrastructure/repositories/demographic-catalog.repository'

@Injectable()
export class ListDemographicsUseCase {
  constructor(
    @Inject()
    private readonly demographicCatalogRepository: DemographicCatalogRepository,
  ) {}

  async execute() {
    return this.demographicCatalogRepository.findAll()
  }
}
