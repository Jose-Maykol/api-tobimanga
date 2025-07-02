import { Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { GetDemographicsUseCase } from '../../application/use-cases/get-demographics.use-case'
import { ResponseBuilder } from '@/common/utils/response.util'

@Controller()
@ApiTags('Demografías')
export class DemographicController {
  constructor(
    private readonly getDemographicsUseCase: GetDemographicsUseCase,
  ) {}

  @Get()
  async getDemographics() {
    const demographics = await this.getDemographicsUseCase.execute()
    return ResponseBuilder.success({
      message: 'Demografías obtenidas correctamente',
      data: {
        demographics,
      },
    })
  }
}
