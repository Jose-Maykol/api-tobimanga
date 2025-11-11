import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'

import { ROLES } from '@/common/constants/roles.const'
import { Roles } from '@/modules/auth/interface/decorators/roles.decorator'
import { JwtAuthGuard } from '@/modules/auth/interface/guards/jwt-auth.guard'
import { RolesGuard } from '@/modules/auth/interface/guards/roles.guard'

import { UploadFileUseCase } from '../application/use-cases/upload-file.use-case'
import { FileValidationPipe } from './pipes/file-validation.pipe'

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(ROLES.ADMIN)
@Controller()
export class UploadController {
  constructor(private readonly uploadFileUseCase: UploadFileUseCase) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(new FileValidationPipe({ maxSizeMB: 5 }))
    file: Express.Multer.File,
  ) {
    await this.uploadFileUseCase.execute(file)
  }
}
