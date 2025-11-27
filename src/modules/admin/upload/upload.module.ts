import { Module } from '@nestjs/common'

import { DatabaseModule } from '@/core/database/database.module'
import { StorageModule } from '@/core/storage/storage.module'
import { InfrastructureModule } from '@/infrastructure/infraestructure.module'

import { FindUploadByUrlUseCase } from './application/use-cases/find-upload-by-url.use-case'
import { UpdateUploadStatusUseCase } from './application/use-cases/update-upload-status.use-case'
import { UploadFileUseCase } from './application/use-cases/upload-file.use-case'
import { UploadController } from './interface/controllers/upload.controller'

@Module({
  imports: [InfrastructureModule, DatabaseModule, StorageModule],
  providers: [
    UploadFileUseCase,
    UpdateUploadStatusUseCase,
    FindUploadByUrlUseCase,
  ],
  controllers: [UploadController],
  exports: [UpdateUploadStatusUseCase, FindUploadByUrlUseCase],
})
export class UploadModule {}
