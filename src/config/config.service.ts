/* eslint-disable @typescript-eslint/no-var-requires */
import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { Chapter } from 'src/models/chapter.entity'
import { Genre } from 'src/models/gnre.entity'
import { Manga } from 'src/models/manga.entity'
import { MangaGenre } from 'src/models/mangaGenre.entity'
import { User } from 'src/models/user.entity'
import { UserChapter } from 'src/models/userChapter.entity'
import { UserManga } from 'src/models/userManga.entity'

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
      ssl: false,
      synchronize: false,
    }
  }
}

const configService = new ConfigService(process.env).ensureValues([
  'POSTGRES_HOST',
  'POSTGRES_PORT',
  'POSTGRES_USER',
  'POSTGRES_PASSWORD',
  'POSTGRES_DATABASE',
])

export { configService }
