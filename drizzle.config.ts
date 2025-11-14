import { defineConfig } from 'drizzle-kit'

import { ConfigService } from '@nestjs/config'

import 'dotenv/config'

const configService = new ConfigService()

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/core/database/schemas',
  out: './src/core/database/migrations',
  dbCredentials: {
    host: configService.get('POSTGRES_HOST') || '',
    port: configService.get('POSTGRES_PORT') || 5432,
    user: configService.get('POSTGRES_USER') || '',
    password: configService.get('POSTGRES_PASSWORD') || '',
    database: configService.get('POSTGRES_DATABASE') || '',
    ssl: configService.get('POSTGRES_SSL') === 'true',
  },
})
