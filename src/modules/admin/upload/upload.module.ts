import { Module } from '@nestjs/common'

import { DatabaseModule } from '@/core/database/database.module'
import { StorageModule } from '@/core/storage/storage.module'
import { AuthModule } from '@/modules/auth/auth.module'

import { FindUploadByUrlUseCase } from './application/use-cases/find-upload-by-url.use-case'
import { ListUploadsUseCase } from './application/use-cases/list-uploads.use-case'
import { UpdateUploadStatusUseCase } from './application/use-cases/update-upload-status.use-case'
import { UploadFileUseCase } from './application/use-cases/upload-file.use-case'
import { UPLOAD_REPOSITORY } from './domain/tokens'
import { UploadRepositoryImpl } from './infrastructure/repositories/upload.repository.impl'
import { UploadController } from './interface/controllers/upload.controller'

@Module({
  imports: [DatabaseModule, StorageModule, AuthModule],
  providers: [
    { provide: UPLOAD_REPOSITORY, useClass: UploadRepositoryImpl },
    UploadFileUseCase,
    UpdateUploadStatusUseCase,
    FindUploadByUrlUseCase,
    ListUploadsUseCase,
  ],
  controllers: [UploadController],
  exports: [UpdateUploadStatusUseCase, FindUploadByUrlUseCase],
})
export class UploadModule {}
