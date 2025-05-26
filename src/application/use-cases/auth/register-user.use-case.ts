import { User } from '@/domain/entities/user'
import { UserRepository } from '@/domain/repositories/user.repository'
import { Inject } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { createUserFactory } from '@/auth/domain/factories/create-user.factory'

interface RegisterUserUseCaseParams {
  email: string
  password: string
  username: string
}

interface RegisterUserUseCaseResult {
  id: string
  email: string
  username: string
  role: string
}

export class RegisterUserUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute({
    email,
    password,
    username,
  }: RegisterUserUseCaseParams): Promise<RegisterUserUseCaseResult> {
    const user = await this.userRepository.exists(email)

    if (user) throw new Error('El usuario ya existe')

    const hashedPassword = await this.hashPassword(password)

    const newUser: User = createUserFactory({
      email,
      password: hashedPassword,
      username,
    })

    await this.userRepository.save(newUser)

    return {
      id: newUser.id,
      email: newUser.email,
      username: newUser.username,
      role: newUser.role.toLowerCase(),
    }
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10)
  }
}
