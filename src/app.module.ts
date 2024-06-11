import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { configService } from './config/config.service'
import { MangasModule } from './mangas/mangas.module'
import { AuthModule } from './auth/auth.module'

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    AuthModule,
    MangasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
