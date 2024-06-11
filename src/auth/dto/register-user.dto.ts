import { IsEmail, IsString } from 'class-validator'

export class RegisterUserDto {
  @IsString()
  username: string

  @IsString()
  password: string

  @IsEmail()
  email: string
}
