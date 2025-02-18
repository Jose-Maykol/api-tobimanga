import { BadRequestException } from '@nestjs/common'

export class InvalidDemographicException extends BadRequestException {
  constructor(message: string) {
    super(message)
  }
}
