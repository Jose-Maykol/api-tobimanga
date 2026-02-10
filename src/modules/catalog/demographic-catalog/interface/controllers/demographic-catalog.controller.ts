import { Controller, Get, Inject } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { ResponseBuilder } from '@/common/utils/response.util'

import { ListDemographicsUseCase } from '../../application/use-cases/list-demographics.use-case'

@Controller('demographics')
@ApiTags('Catálogo de Demografías')
export class DemographicCatalogController {
  constructor(
    @Inject()
    private readonly listDemographicsUseCase: ListDemographicsUseCase,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Listar demografías',
    description: 'Obtiene una lista de todas las demografías disponibles.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de demografías obtenida exitosamente.',
  })
  async findAll() {
    const demographics = await this.listDemographicsUseCase.execute()
    return ResponseBuilder.success({
      data: demographics,
    })
  }
}
