import { Body, Controller, Post, UsePipes } from '@nestjs/common'
import { RegisterUserDto, registerUserSchema } from '../dto/register-user.dto'
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { RegisterUserCommand } from '../../application/commands/register-user.command'
import { UserLoginQuery } from '../../application/queries/login-user.query'
import { UserLoginDto, userLoginSchema } from '../dto/login-user.dto'

@Controller()
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('login')
  @UsePipes(new ZodValidationPipe(userLoginSchema))
  async login(@Body() userLoginDto: UserLoginDto) {
    const { email, password } = userLoginDto
    const command = new UserLoginQuery(email, password)
    return await this.queryBus.execute(command)
  }

  @Post('register')
  @UsePipes(new ZodValidationPipe(registerUserSchema))
  async register(@Body() registerUserDto: RegisterUserDto) {
    const command = new RegisterUserCommand(registerUserDto)
    return await this.commandBus.execute(command)
  }
}
