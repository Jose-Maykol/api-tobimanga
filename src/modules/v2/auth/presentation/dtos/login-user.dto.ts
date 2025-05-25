import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, MinLength } from 'class-validator'

export class UserLoginDto {
  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'usuario@correo.com',
    format: 'email',
  })
  @IsEmail()
  email: string

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'strongpassword123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string
}
