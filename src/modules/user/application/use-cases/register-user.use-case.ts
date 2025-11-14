import * as bcrypt from 'bcrypt'

import { Inject, Injectable, Logger } from '@nestjs/common'

import { User } from '@/core/domain/entities/user.entity'
import { UserAlreadyExistsException } from '@/core/domain/exceptions/user/user-already-exists.exception'
import { createUserFactory } from '@/core/domain/factories/user/create-user.factory'
import { UserRepository } from '@/core/domain/repositories/user.repository'

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
  private readonly logger = new Logger(RegisterUserUseCase.name)

  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute({
    email,
    password,
    username,
  }: RegisterUserUseCaseParams): Promise<RegisterUserUseCaseResult> {
    this.logger.log(`Register attempt for email: ${email}`)

    const user = await this.userRepository.exists(email)

    if (user) {
      this.logger.warn(`User already exists for email: ${email}`)
      throw new UserAlreadyExistsException()
    }

    const hashedPassword = await this.hashPassword(password)

    const newUser: User = createUserFactory({
      email,
      password: hashedPassword,
      username,
    })

    await this.userRepository.save(newUser)

    this.logger.log(
      `User registered successfully: ${newUser.id}, email: ${email}`,
    )

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
