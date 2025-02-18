import { NotFoundException } from '@nestjs/common'

export class DemographicNotFoundException extends NotFoundException {
  constructor() {
    super(`No se encontraron demografias`)
  }
}
