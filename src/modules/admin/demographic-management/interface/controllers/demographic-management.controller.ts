import { Controller, Get, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { ROLES } from '@/common/constants/roles.const'
import { ResponseBuilder } from '@/common/utils/response.util'
import { Roles } from '@/modules/auth/interface/decorators/roles.decorator'
import { JwtAuthGuard } from '@/modules/auth/interface/guards/jwt-auth.guard'
import { RolesGuard } from '@/modules/auth/interface/guards/roles.guard'

import { GetAllDemographicsUseCase } from '../../application/use-cases/get-all-demographics.use-case'

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(ROLES.ADMIN)
@Controller()
@ApiTags('Demografías')
export class DemographicManagementController {
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
