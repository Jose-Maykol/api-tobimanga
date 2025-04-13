import { NotFoundException } from '@nestjs/common'

export class DemographicNotFoundException extends NotFoundException {
  constructor() {
    super({
      code: 'DEMOGRAPHIC_NOT_FOUND',
      message: 'No se encontró la demografía',
    })
  }
}
