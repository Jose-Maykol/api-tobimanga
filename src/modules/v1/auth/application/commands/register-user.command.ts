import { ICommand } from '@nestjs/cqrs'
import { RegisterUserDto } from '../../interface/dto/register-user.dto'

export class RegisterUserCommand implements ICommand {
  constructor(public readonly user: RegisterUserDto) {}
}
