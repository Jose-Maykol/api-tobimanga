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

import { GetCatalogStatisticsUseCase } from '../../application/use-cases/get-catalog-statistics.use-case'
import { GetEngagementStatisticsUseCase } from '../../application/use-cases/get-engagement-statistics.use-case'
import { GetSystemStatisticsUseCase } from '../../application/use-cases/get-system-statistics.use-case'
import { GetUploadStatisticsUseCase } from '../../application/use-cases/get-upload-statistics.use-case'
import { GetUserStatisticsUseCase } from '../../application/use-cases/get-user-statistics.use-case'
import { StatisticsSwagger } from '../swagger/statistics.swagger'

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(ROLES.ADMIN)
@Controller()
@ApiTags('Estadísticas')
@ApiBearerAuth()
export class StatisticsController {
  constructor(
    private readonly getCatalogStatisticsUseCase: GetCatalogStatisticsUseCase,
    private readonly getUserStatisticsUseCase: GetUserStatisticsUseCase,
    private readonly getEngagementStatisticsUseCase: GetEngagementStatisticsUseCase,
    private readonly getUploadStatisticsUseCase: GetUploadStatisticsUseCase,
    private readonly getSystemStatisticsUseCase: GetSystemStatisticsUseCase,
  ) {}

  @Get('catalog')
  @ApiOperation({
    summary: 'Estadísticas del catálogo',
    description:
      'Obtiene estadísticas del catálogo de mangas: totales, distribución por estado de publicación, demografía, géneros y tendencias temporales.',
  })
  @ApiResponse(StatisticsSwagger.catalog.responses.ok)
  async getCatalogStatistics() {
    const data = await this.getCatalogStatisticsUseCase.execute()

    return ResponseBuilder.success({
      message: 'Estadísticas del catálogo obtenidas exitosamente',
      data,
    })
  }

  @Get('users')
  @ApiOperation({
    summary: 'Estadísticas de usuarios',
    description:
      'Obtiene estadísticas de usuarios: totales, distribución por rol, estado activo/inactivo y tendencias de registros.',
  })
  @ApiResponse(StatisticsSwagger.users.responses.ok)
  async getUserStatistics() {
    const data = await this.getUserStatisticsUseCase.execute()

    return ResponseBuilder.success({
      message: 'Estadísticas de usuarios obtenidas exitosamente',
      data,
    })
  }

  @Get('engagement')
  @ApiOperation({
    summary: 'Estadísticas de engagement',
    description:
      'Obtiene estadísticas de interacción: rankings de mangas, distribución de estados de lectura, actividad de lectura y distribución de ratings.',
  })
  @ApiResponse(StatisticsSwagger.engagement.responses.ok)
  async getEngagementStatistics() {
    const data = await this.getEngagementStatisticsUseCase.execute()

    return ResponseBuilder.success({
      message: 'Estadísticas de engagement obtenidas exitosamente',
      data,
    })
  }

  @Get('uploads')
  @ApiOperation({
    summary: 'Estadísticas de uploads',
    description:
      'Obtiene estadísticas de archivos subidos: totales, distribución por estado y tendencia temporal.',
  })
  @ApiResponse(StatisticsSwagger.uploads.responses.ok)
  async getUploadStatistics() {
    const data = await this.getUploadStatisticsUseCase.execute()

    return ResponseBuilder.success({
      message: 'Estadísticas de uploads obtenidas exitosamente',
      data,
    })
  }

  @Get('system')
  @ApiOperation({
    summary: 'Estadísticas del sistema',
    description:
      'Obtiene estadísticas de cron jobs: totales, ejecuciones fallidas recientes, tendencias de ejecución y duración promedio.',
  })
  @ApiResponse(StatisticsSwagger.system.responses.ok)
  async getSystemStatistics() {
    const data = await this.getSystemStatisticsUseCase.execute()

    return ResponseBuilder.success({
      message: 'Estadísticas del sistema obtenidas exitosamente',
      data,
    })
  }
}
