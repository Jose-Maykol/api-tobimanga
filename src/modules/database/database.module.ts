import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { Pool } from 'pg'
import { DATABASE_CONNECTION } from './constants/constants'
import { DrizzleService } from './services/drizzle.service'

@Global()
@Module({
  imports: [ConfigModule],
  exports: [DrizzleService, DATABASE_CONNECTION],
  providers: [
    {
      provide: DATABASE_CONNECTION,
      useFactory: async (configService: ConfigService) => {
        return new Pool({
          user: configService.get('POSTGRES_USER'),
          host: configService.get('POSTGRES_HOST'),
          database: configService.get('POSTGRES_DATABASE'),
          password: configService.get('POSTGRES_PASSWORD'),
          port: configService.get('POSTGRES_PORT'),
        })
      },
      inject: [ConfigService],
    },
    DrizzleService,
  ],
})
export class DatabaseModule {}
