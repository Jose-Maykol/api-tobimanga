import { IQuery } from '@nestjs/cqrs'

export class UserLoginQuery implements IQuery {
  constructor(
    public readonly email: string,
    public readonly password: string,
  ) {
    this.email = email
    this.password = password
  }
}
