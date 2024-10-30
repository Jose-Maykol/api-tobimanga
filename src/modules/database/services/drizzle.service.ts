import { Inject, Injectable, Logger } from '@nestjs/common'
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { databaseSchema } from '../schemas'
import { DATABASE_CONNECTION } from '../constants/constants'

@Injectable()
export class DrizzleService {
  public db: NodePgDatabase<typeof databaseSchema>
  private readonly logger = new Logger(DrizzleService.name)

  constructor(@Inject(DATABASE_CONNECTION) private readonly pool: Pool) {
    try {
      this.db = drizzle(this.pool, { schema: databaseSchema })
      this.logger.log('Database connection established successfully')
    } catch (error) {
      this.logger.error('Error connecting to the database', error.stack)
    }
  }
}
