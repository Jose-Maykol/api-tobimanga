import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod'

export const userLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export type UserLoginDto = z.infer<typeof userLoginSchema>

export class UserLoginSwaggerDto {
  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'usuario@correo.com',
    format: 'email',
  })
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'strongpassword123',
    minLength: 6,
  })
  password: string;
}