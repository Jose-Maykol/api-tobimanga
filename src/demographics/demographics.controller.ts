import { Controller, Get } from '@nestjs/common'
import { DemographicsService } from './demographics.service'

@Controller('demographics')
export class DemographicsController {
  constructor(private readonly demographicsService: DemographicsService) {}

  @Get()
  async getDemographics(): Promise<{
    demographics: { id: string; name: string }[]
  }> {
    const demographics = await this.demographicsService.getDemographics()
    return {
      demographics: demographics,
    }
  }
}
