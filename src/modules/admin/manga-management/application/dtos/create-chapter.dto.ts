import { IsDateString, IsOptional, IsString, MinLength } from 'class-validator'

export class CreateChapterDto {
  @IsOptional()
  @IsString({ message: 'El título debe ser un string' })
  @MinLength(1, { message: 'El título debe tener al menos 1 carácter' })
  title?: string

  @IsOptional()
  @IsDateString(
    {},
    { message: 'La fecha de lanzamiento debe ser una fecha válida' },
  )
  releaseDate?: string
}
