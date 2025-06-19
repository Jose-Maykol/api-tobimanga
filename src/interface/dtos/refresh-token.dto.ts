import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class RefreshTokenDto {
  @ApiProperty({
    description: 'Refresh token para obtener un nuevo token de acceso',
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
