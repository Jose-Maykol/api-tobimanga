import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { AdminMangasController } from './interface/controllers/admin-mangas.controller'

@Module({
  imports: [CqrsModule],
  controllers: [AdminMangasController],
  providers: [],
  exports: [],
})
export class AdminModule {}
