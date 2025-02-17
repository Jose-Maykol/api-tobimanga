import { BadRequestException } from '@nestjs/common'

export class InvalidGenreException extends BadRequestException {
  constructor(message: string) {
    super(message)
  }
}
