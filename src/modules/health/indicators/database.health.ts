import { sql } from 'drizzle-orm/sql'

import { Inject, Injectable } from '@nestjs/common'
import { HealthIndicatorResult, HealthIndicatorService } from '@nestjs/terminus'

import { DATABASE_SERVICE } from '@/core/database/constants/database.constants'
import { IDatabaseService } from '@/core/database/interfaces/database.service'

@Injectable()
export class DrizzleHealthIndicator {
  constructor(
    @Inject(DATABASE_SERVICE)
    private readonly databaseService: IDatabaseService,
    private readonly healthIndicatorService: HealthIndicatorService,
  ) {}

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      await this.databaseService.client.execute(sql`SELECT 1`)
      return this.healthIndicatorService.check(key).up()
    } catch (error) {
      return this.healthIndicatorService.check(key).down({
        message: (error as Error).message,
      })
    }
  }
}
