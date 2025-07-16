import { Inject, Injectable } from '@nestjs/common'
import { DemographicRepository } from '../../domain/repositories/demographic.repository'
import { Demographic } from '../../domain/entities/demographic.entity'
import { DemographicNotFoundException } from '../../domain/exceptions/demographic-not-found.exception'

@Injectable()
export class GetDemographicByIdUseCase {
  constructor(
    @Inject('DemographicRepository')
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
