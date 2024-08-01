import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { UserManga } from '../models/userManga.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '../models/user.entity'
import { Manga } from '../models/manga.entity'
import { BullModule } from '@nestjs/bull'
import { configService } from '@/config/config.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([UserManga, User, Manga]),
    BullModule.forRoot({
      redis: {
        host: configService.getRedisConfig().host,
        port: configService.getRedisConfig().port,
        password: configService.getRedisConfig().password,
        tls: {},
      },
    }),
    BullModule.registerQueue({
      name: 'chapters-creation',
      defaultJobOptions: {
        attempts: 2,
      },
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
