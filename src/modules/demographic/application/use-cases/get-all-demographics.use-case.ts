import { Inject, Injectable } from '@nestjs/common'
import { DemographicRepository } from '../../domain/repositories/demographic.repository'
import { Demographic } from '../../domain/entities/demographic.entity'

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
