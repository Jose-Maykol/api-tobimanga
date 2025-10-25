import { User } from '@/modules/user/domain/entities/user.entity'
import { UserAlreadyExistsException } from '@/modules/user/domain/exceptions/user-already-exists.exception'
import { createUserFactory } from '@/modules/user/domain/factories/create-user.factory'
import { Inject, Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { UserRepository } from '../../domain/repositories/user.repository'

export interface RegisterUserUseCaseParams {
  email: string
  password: string
  username: string
}

export interface RegisterUserUseCaseResult {
  id: string
  email: string
  username: string
  role: string
}

@Injectable()
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

    if (user) throw new UserAlreadyExistsException()

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
