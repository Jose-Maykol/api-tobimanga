import { Demography } from '@/models/demography.entity'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class DemographicsService {
  constructor(
    @InjectRepository(Demography)
    private readonly demographicsRepository: Repository<Demography>,
  ) {}

  public async getDemographics(): Promise<{ id: string; name: string }[]> {
    return this.demographicsRepository.find({ select: ['id', 'name'] })
  }
}
