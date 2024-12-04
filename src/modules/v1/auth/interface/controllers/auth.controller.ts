import { Body, Controller, Post, UsePipes } from '@nestjs/common'
import { RegisterUserDto, registerUserSchema } from '../dto/register-user.dto'
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { RegisterUserCommand } from '../../application/commands/register-user.command'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('login')
  async login() {
    return 'Login exitoso'
  }

  @Post('register')
  @UsePipes(new ZodValidationPipe(registerUserSchema))
  async register(@Body() registerUserDto: RegisterUserDto) {
    const command = new RegisterUserCommand(registerUserDto)
    return await this.commandBus.execute(command)
  }
}
