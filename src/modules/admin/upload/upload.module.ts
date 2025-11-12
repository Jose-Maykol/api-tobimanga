import { Module } from '@nestjs/common'

import { DatabaseModule } from '@/core/database/database.module'
import { StorageModule } from '@/core/storage/storage.module'
import { InfrastructureModule } from '@/infrastructure/infraestructure.module'

import { UploadFileUseCase } from './application/use-cases/upload-file.use-case'
import { UploadController } from './interface/controllers/upload.controller'

@Module({
  imports: [InfrastructureModule, DatabaseModule, StorageModule],
  providers: [UploadFileUseCase],
  controllers: [UploadController],
  exports: [],
})
export class UploadModule {}
