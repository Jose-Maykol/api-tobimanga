import {
  Body,
  Controller,
  Inject,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

import { ROLES } from '@/common/constants/roles.const'
import { Roles } from '@/modules/auth/interface/decorators/roles.decorator'
import { JwtAuthGuard } from '@/modules/auth/interface/guards/jwt-auth.guard'
import { RolesGuard } from '@/modules/auth/interface/guards/roles.guard'

import { UpdateUploadStatusUseCase } from '../../application/use-cases/update-upload-status.use-case'
import { UploadFileUseCase } from '../../application/use-cases/upload-file.use-case'
import { UpdateStatusUploadDto } from '../dtos/update-status-upload.dto'
import { UploadFileDto } from '../dtos/upload-file.dto'
import { FileValidationPipe } from '../pipes/file-validation.pipe'
import { UploadSwagger } from '../swagger/upload.swagger'

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(ROLES.ADMIN)
@ApiTags('Upload')
@Controller()
export class UploadController {
  constructor(
    @Inject()
    private readonly uploadFileUseCase: UploadFileUseCase,
    @Inject()
    private readonly updateStatusUploadUseCase: UpdateUploadStatusUseCase,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Subir un archivo',
    description: 'Sube un archivo. Solo accesible por usuarios ADMIN.',
  })
  @ApiBody(UploadSwagger.uploadFile.body)
  @ApiResponse(UploadSwagger.uploadFile.responses.created)
  @ApiResponse(UploadSwagger.uploadFile.responses.badRequest)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(new FileValidationPipe({ maxSizeMB: 5 }))
    file: Express.Multer.File,
    @Body() dto: UploadFileDto,
  ) {
    await this.uploadFileUseCase.execute({
      file,
      entityType: dto.entityType,
    })
  }

  @Post('status')
  @ApiOperation({
    summary: 'Actualizar estado de un archivo subido',
    description:
      'Actualiza el estado de un archivo subido. Solo accesible por usuarios ADMIN.',
  })
  @ApiBody(UploadSwagger.updateUploadStatus.body)
  @ApiResponse(UploadSwagger.updateUploadStatus.responses.ok)
  @ApiResponse(UploadSwagger.updateUploadStatus.responses.badRequest)
  @ApiBearerAuth()
  async updateUploadStatus(@Body() dto: UpdateStatusUploadDto): Promise<void> {
    await this.updateStatusUploadUseCase.execute(dto)
  }
}
