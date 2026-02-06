import { IsNotEmpty, IsString, MinLength } from 'class-validator'

export class UpdateChapterDto {
  @IsString({ message: 'El título debe ser un string' })
  @IsNotEmpty({ message: 'El título es requerido' })
  @MinLength(1, { message: 'El título debe tener al menos 1 carácter' })
  title: string
}
