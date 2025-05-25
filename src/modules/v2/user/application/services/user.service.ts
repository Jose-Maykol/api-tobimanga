import { Inject, Injectable } from '@nestjs/common'
import { IUserRepository } from '../../domain/repositories/user.repository'
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async findByEmail(email: string) {
    const user = await this.userRepository.findByEmail(email)
    return user
  }

  async findById(id: string) {
    return this.userRepository.findById(id)
  }

  async updateRefreshToken(id: string, refreshToken: string | null) {
    const hashedToken = refreshToken
      ? await bcrypt.hash(refreshToken, 10)
      : null
    await this.userRepository.update(id, {
      refreshToken: hashedToken,
    })
  }

  async validateRefreshToken(id: string, refreshToken: string) {
    const user = await this.userRepository.findById(id)
    if (!user || !user.refreshToken) return false
    const isValid = await bcrypt.compare(refreshToken, user.refreshToken)
    return isValid
  }
}
