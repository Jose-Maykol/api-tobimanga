import * as bcrypt from 'bcrypt'

import { Injectable } from '@nestjs/common'

import { PasswordHashingService } from '../../domain/services/password-hashing.service'

@Injectable()
export class PasswordHashingServiceImpl implements PasswordHashingService {
  private readonly SALT_ROUNDS = 10

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS)
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }
}
