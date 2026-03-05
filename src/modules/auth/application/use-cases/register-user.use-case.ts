import { Inject, Injectable, Logger } from '@nestjs/common'

import { User } from '../../domain/entities/auth-user.entity'
import { UserAlreadyExistsException } from '../../domain/exceptions/user-already-exists.exception'
import { UserRepository } from '../../domain/repositories/auth-user.repository'
import { PasswordHashingService } from '../../domain/services/password-hashing.service'

export interface RegisterUserUseCaseParams {
  email: string
  password: string
  username: string
}

export interface RegisterUserUseCaseResult {
  id: string
  email: string
  username: string
  roles: string[]
}

@Injectable()
export class RegisterUserUseCase {
  private readonly logger = new Logger(RegisterUserUseCase.name)

  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    @Inject('PasswordHashingService')
    private readonly passwordHashingService: PasswordHashingService,
  ) {}

  async execute({
    email,
    password,
    username,
  }: RegisterUserUseCaseParams): Promise<RegisterUserUseCaseResult> {
    this.logger.log(`Register attempt for email: ${email}`)

    const userExists = await this.userRepository.exists(email)

    if (userExists) {
      this.logger.warn(`User already exists for email: ${email}`)
      throw new UserAlreadyExistsException(email)
    }

    const hashedPassword = await this.passwordHashingService.hash(password)

    const user: User = {
      id: crypto.randomUUID(),
      email,
      password: hashedPassword,
      username,
      profileImage: null,
      coverImage: null,
      roles: ['USER'],
      isActive: true,
      refreshToken: null,
      createdAt: new Date(),
      updatedAt: null,
    }

    await this.userRepository.create(user)

    this.logger.log(`User registered successfully: ${user.id}, email: ${email}`)

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      roles: user.roles,
    }
  }
}
