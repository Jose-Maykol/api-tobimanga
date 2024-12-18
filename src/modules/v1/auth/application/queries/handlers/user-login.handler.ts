import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { UserLoginQuery } from '../login-user.query'
import { Inject, NotFoundException } from '@nestjs/common'
import { UserRepository } from '../../../domain/repositories/user.repository'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'

@QueryHandler(UserLoginQuery)
export class UserLoginHandler implements IQueryHandler<UserLoginQuery> {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(query: UserLoginQuery) {
    const { email, password } = query

    // TODO: se puede optimizar para no obtener todos los campos en el find
    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      throw new NotFoundException('Usuario no encontrado')
    }

    const match = await bcrypt.compare(password, user.getPassword())
    if (!match) {
      throw new NotFoundException('Contraseña incorrecta')
    }

    const payload = {
      username: user.getUsername(),
      email: user.getEmail(),
      sub: user.getId(),
    }

    const accessToken = this.jwtService.sign(payload)

    return {
      message: 'Login exitoso',
      accessToken,
      user: {
        id: user.getId(),
        email: user.getEmail(),
        username: user.getUsername(),
        profileImage: user.getProfileImage(),
      },
    }
  }
}
