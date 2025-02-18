import { BadRequestException } from '@nestjs/common'

export class InvalidAuthorException extends BadRequestException {
  constructor(message: string) {
    super(message)
  }
}
