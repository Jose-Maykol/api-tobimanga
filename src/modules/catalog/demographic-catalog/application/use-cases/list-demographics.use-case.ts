import { Inject, Injectable } from '@nestjs/common'

import { IDemographicCatalogRepository } from '../../domain/repositories/demographic-catalog.repository'
import { DEMOGRAPHIC_CATALOG_REPOSITORY } from '../../infrastructure/tokens'

@Injectable()
export class ListDemographicsUseCase {
  constructor(
    @Inject(DEMOGRAPHIC_CATALOG_REPOSITORY)
    private readonly demographicCatalogRepository: IDemographicCatalogRepository,
  ) {}

  async execute() {
    return this.demographicCatalogRepository.findAll()
  }
}
