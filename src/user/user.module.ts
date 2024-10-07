import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { UserManga } from '../models/userManga.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '../models/user.entity'
import { Manga } from '../models/manga.entity'

@Module({
  imports: [TypeOrmModule.forFeature([UserManga, User, Manga])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
