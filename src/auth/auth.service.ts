import { RegisterUserDto } from './dto/register-user.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../models/user.entity'
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async findOne(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } })
  }

  async validate(user: User, password: string): Promise<boolean> {
    const match = await bcrypt.compare(password, user.password)
    if (match) {
      return true
    }
    return false
  }

  async validateToken(id: string): Promise<boolean> {
    return this.userRepository.exists({ where: { id } })
  }

  async login(user: any) {
    const payload = {
      username: user.username,
      email: user.email,
      sub: user.id,
    }
    return {
      access_token: this.jwtService.sign(payload),
    }
  }

  async register(registerUserDto: RegisterUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(registerUserDto.password, 10)
    const user = this.userRepository.create({
      ...registerUserDto,
      password: hashedPassword,
    })
    return this.userRepository.save(user)
  }
}
