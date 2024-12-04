import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { RegisterUserCommand } from '../register-user.command'
import { Inject } from '@nestjs/common'
import { UserRepository } from '../../../domain/repositories/user.repository'
import { UserFactory } from '../../../domain/factories/user.factory'
import * as bcrypt from 'bcrypt'

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler
  implements ICommandHandler<RegisterUserCommand>
{
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    private readonly userFactory: UserFactory,
  ) {}

  async execute(command: RegisterUserCommand) {
    const { user } = command
    const userExists = await this.userRepository.exists(user.email)

    if (userExists) {
      throw new Error('Este usuario ya existe')
    }

    const hashedPassword = await bcrypt.hash(user.password)

    const userEntity = this.userFactory.create({
      ...user,
      password: hashedPassword,
    })
    await this.userRepository.save(userEntity)

    return {
      message: 'Usuario creado con exito',
    }
  }
}
