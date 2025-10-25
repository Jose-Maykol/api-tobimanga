import { Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { ResponseBuilder } from '@/common/utils/response.util'

import { GetAllDemographicsUseCase } from '../../application/use-cases/get-all-demographics.use-case'

@Controller()
@ApiTags('Demografías')
export class DemographicController {
  constructor(
    private readonly getAllDemographicsUseCase: GetAllDemographicsUseCase,
  ) {}

  @Get()
  async getDemographics() {
    const demographics = await this.getAllDemographicsUseCase.execute()
    return ResponseBuilder.success({
      message: 'Demografías obtenidas correctamente',
      data: {
        demographics,
      },
    })
  }
}
