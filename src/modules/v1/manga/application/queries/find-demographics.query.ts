import { IQuery } from '@nestjs/cqrs'

export class FindDemographicsQuery implements IQuery {
  constructor() {
    Object.assign(this)
  }
}
