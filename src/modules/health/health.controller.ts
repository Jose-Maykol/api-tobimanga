import { Controller, Get } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import {
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
} from '@nestjs/terminus'

import { DrizzleHealthIndicator } from './indicators/database.health'

@ApiTags('Health Check')
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly db: DrizzleHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({
    summary: 'Verificar el estado de salud de la aplicación',
    description:
      'Realiza una serie de chequeos de salud (Base de datos, Memoria).',
  })
  check() {
    return this.health.check([
      () => this.db.isHealthy('database'),
      // El heap no debe exceder los 150MB
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      // El RSS no debe exceder los 150MB
      () => this.memory.checkRSS('memory_rss', 150 * 1024 * 1024),
    ])
  }
}
