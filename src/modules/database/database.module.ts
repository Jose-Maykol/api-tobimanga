import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { Pool } from 'pg'
import { DATABASE_CONNECTION } from './constants/constants'
import { DrizzleService } from './services/drizzle.service'

@Global()
@Module({
  imports: [ConfigModule],
  exports: [DrizzleService],
  providers: [
    {
      provide: DATABASE_CONNECTION,
      useFactory: async (configService: ConfigService) => {
        return new Pool({
          user: configService.get('PROSTGRES_USER'),
          host: configService.get('PROSTGRES_HOST'),
          database: configService.get('PROSTGRES_DB'),
          password: configService.get('PROSTGRES_PASSWORD'),
          port: configService.get('PROSTGRES_PORT'),
        })
      },
      inject: [ConfigService],
    },
    DrizzleService,
  ],
})
export class DatabaseModule {}
