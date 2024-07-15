/* eslint-disable @typescript-eslint/no-var-requires */
import { Chapter } from '../models/chapter.entity'
import { Genre } from '../models/genre.entity'
import { Manga } from '../models/manga.entity'
import { MangaGenre } from '../models/mangaGenre.entity'
import { User } from '../models/user.entity'
import { UserChapter } from '../models/userChapter.entity'
import { UserManga } from '../models/userManga.entity'
import { TypeOrmModuleOptions } from '@nestjs/typeorm'

require('dotenv').config()

class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key]
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`)
    }
    return value
  }

  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k, true))
    return this
  }

  public isProduction(): boolean {
    const mode = this.getValue('NODE_ENV', false)
    return mode != 'development'
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.getValue('POSTGRES_HOST'),
      port: parseInt(this.getValue('POSTGRES_PORT')),
      username: this.getValue('POSTGRES_USER'),
      password: this.getValue('POSTGRES_PASSWORD'),
      database: this.getValue('POSTGRES_DATABASE'),
      entities: [
        User,
        Genre,
        Manga,
        MangaGenre,
        Chapter,
        UserManga,
        UserChapter,
      ],
      migrationsTableName: 'migration',
      migrations: ['src/migration/*.ts'],
      ssl: this.isProduction(),
      synchronize: false,
    }
  }

  public getSecretKey(): string {
    return this.getValue('SECRET_KEY')
  }

  public getRedisConfig() {
    return {
      host: this.getValue('REDIS_HOST'),
      port: parseInt(this.getValue('REDIS_PORT')),
      password: this.getValue('REDIS_PASSWORD'),
    }
  }
}

const configService = new ConfigService(process.env).ensureValues([
  'POSTGRES_HOST',
  'POSTGRES_PORT',
  'POSTGRES_USER',
  'POSTGRES_PASSWORD',
  'POSTGRES_DATABASE',
  'REDIS_HOST',
  'REDIS_PORT',
  'REDIS_PASSWORD',
])

export { configService }
