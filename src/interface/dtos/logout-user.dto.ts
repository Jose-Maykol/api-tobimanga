import { IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class LogoutUserDto {
  @ApiProperty({
    description: 'refresh token que se desea invalidar',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ',
    required: true,
    type: String,
  })
  @IsString({
    message: 'El refresh token debe ser una cadena de texto',
  })
  @IsNotEmpty({
    message: 'El refresh token es requerido',
  })
  refreshToken: string
}
