import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class RegisterUserDto {
  @ApiProperty({
    description: 'Nombre de usuario, debe tener al menos 3 caracteres',
    example: 'usuario123',
    minLength: 3,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  username: string

  @ApiProperty({
    description: 'Contraseña del usuario, debe tener al menos 6 caracteres',
    example: 'password123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'usuario@correo.com',
    format: 'email',
  })
  @IsEmail()
  @MaxLength(255)
  email: string
}
