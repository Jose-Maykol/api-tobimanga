import { Inject, Injectable, Logger, OnModuleDestroy } from '@nestjs/common'
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres'
import { databaseSchema } from '../schemas'
import { IDatabaseService } from '../interfaces/database.interface'
import { DATABASE_CONNECTION } from '../constants/database.constants'
import { Pool } from 'pg'

@Injectable()
export class DatabaseService implements IDatabaseService, OnModuleDestroy {
  private dbInstance: NodePgDatabase<typeof databaseSchema>
  private readonly logger = new Logger(DatabaseService.name)

  constructor(@Inject(DATABASE_CONNECTION) private readonly pool: Pool) {
    this.validateConnection()
  }

  get query(): NodePgDatabase<typeof databaseSchema> {
    return this.dbInstance
  }

  private validateConnection() {
    try {
      this.dbInstance = drizzle(this.pool, {
        schema: databaseSchema,
        logger: process.env.NODE_ENV === 'development',
      })
      this.logger.log('Database connection established')
    } catch (error) {
      this.logger.error('Database connection failed', error.stack)
      throw new Error('Failed to initialize database connection')
    }
  }

  /*   async withTransaction<T>(callback: (tx: Transaction) => Promise<T>): Promise<T> {
    return this.dbInstance.transaction(async (tx) => {
      try {
        const result = await callback(tx)
        return result
      } catch (error) {
        this.logger.error('Transaction failed', error.stack)
        tx.rollback()
        throw error
      }
    })
  } */

  async onModuleDestroy() {
    await this.pool.end()
    this.logger.log('Database connection pool closed')
  }
}
