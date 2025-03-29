import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod'

export const registerUserSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
  email: z.string().email(),
})

export type RegisterUserDto = z.infer<typeof registerUserSchema>


export class RegisterUserSwaggerDto {
  @ApiProperty({
    description: 'Nombre de usuario, debe tener al menos 3 caracteres',
    example: 'usuario123',
    minLength: 3,
  })
  username: string;

  @ApiProperty({
    description: 'Contraseña del usuario, debe tener al menos 6 caracteres',
    example: 'password123',
    minLength: 6,
  })
  password: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'usuario@correo.com',
    format: 'email',
  })
  email: string;
}