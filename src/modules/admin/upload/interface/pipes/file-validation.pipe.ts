import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common'

import { ResponseBuilder } from '@/common/utils/response.util'

const DEFAULT_MAX_SIZE_MB = 5
const DEFAULT_ALLOWED_TYPES: readonly string[] = [
  'image/png',
  'image/jpeg',
  'image/webp',
] as const

export interface FileValidationOptions {
  maxSizeMB?: number
  allowedTypes?: readonly string[]
}

@Injectable()
export class FileValidationPipe implements PipeTransform {
  constructor(private readonly options: FileValidationOptions = {}) {}

  transform(file: Express.Multer.File): Express.Multer.File {
    if (!file) {
      throw new BadRequestException(
        ResponseBuilder.error('No file uploaded.', 'NO_FILE_UPLOADED', 400),
      )
    }

    const maxSizeMB: number = this.options.maxSizeMB ?? DEFAULT_MAX_SIZE_MB
    const allowedTypes: readonly string[] =
      this.options.allowedTypes ?? DEFAULT_ALLOWED_TYPES

    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        ResponseBuilder.error(
          'File type not allowed.',
          'FILE_TYPE_NOT_ALLOWED',
          400,
        ),
      )
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      throw new BadRequestException(
        ResponseBuilder.error(
          `File size must not exceed ${maxSizeMB} MB.`,
          'FILE_TOO_LARGE',
          400,
        ),
      )
    }

    return file
  }
}
