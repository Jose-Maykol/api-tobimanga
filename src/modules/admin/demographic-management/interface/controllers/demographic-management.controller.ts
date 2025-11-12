import { Controller, Get, UseGuards } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

import { ROLES } from '@/common/constants/roles.const'
import { ResponseBuilder } from '@/common/utils/response.util'
import { Roles } from '@/modules/auth/interface/decorators/roles.decorator'
import { JwtAuthGuard } from '@/modules/auth/interface/guards/jwt-auth.guard'
import { RolesGuard } from '@/modules/auth/interface/guards/roles.guard'

import { GetAllDemographicsUseCase } from '../../application/use-cases/get-all-demographics.use-case'
import { DemographicManagementSwagger } from '../swagger/demographic-management.swagger'

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(ROLES.ADMIN)
@Controller()
@ApiTags('Gestión de Demografías')
export class DemographicManagementController {
  constructor(
    private readonly getAllDemographicsUseCase: GetAllDemographicsUseCase,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener todas las demografías',
    description: 'Obtiene la lista de todas las demografías disponibles.',
  })
  @ApiResponse(DemographicManagementSwagger.getAll.responses.ok)
  @ApiBearerAuth()
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
