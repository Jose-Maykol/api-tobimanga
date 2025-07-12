import {
  ArrayMinSize,
  IsArray,
  IsBase64,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  MinLength,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'
import { PublicationStatus } from '../enums/publication-status.enum'

// DTO para autores
export class SaveMangaAuthorDto {
  @IsString({ message: 'El campo id del autor debe ser un string' })
  @IsNotEmpty({ message: 'El campo id del autor es requerido' })
  id: string
}

// DTO para generos
export class SaveMangaGenreDto {
  @IsString({ message: 'El campo id del género debe ser un string' })
  @IsNotEmpty({ message: 'El campo id del género es requerido' })
  id: string
}

// DTO para demografias
export class SaveMangaDemographicDto {
  @IsString()
  @IsNotEmpty({ message: 'demographic id es requerido' })
  id: string
}

export class ImageDto {
  @IsString({ message: 'El tipo de contenido es requerido' })
  @IsNotEmpty({ message: 'El tipo de contenido es requerido' })
  @Matches(/^image\/(png|jpeg|jpg|webp)$/, {
    message:
      'El tipo de contenido debe ser una imagen válida (png, jpeg, jpg, webp)',
  })
  contentType: string

  @IsString({ message: 'La imagen es requerida' })
  @IsNotEmpty({ message: 'La imagen es requerida' })
  @IsBase64({}, { message: 'La imagen debe estar en formato base64' })
  data: string
}

export class CreateMangaDto {
  @IsString({ message: 'El nombre original debe ser un string' })
  @IsNotEmpty({ message: 'El nombre original es requerido' })
  @MinLength(3, {
    message: 'El nombre original debe tener al menos 3 caracteres',
  })
  originalName: string

  @IsOptional()
  @IsArray({ message: 'Los nombres alternativos deben ser un array' })
  @IsString({
    each: true,
    message: 'Cada nombre alternativo debe ser un string',
  })
  alternativeNames?: string[]

  @IsString({ message: 'La sinopsis debe ser un string' })
  @IsNotEmpty({ message: 'La sinopsis es requerida' })
  @MinLength(10, { message: 'La sinopsis debe tener al menos 10 caracteres' })
  sinopsis: string

  @IsNumber({}, { message: 'El número de capítulos debe ser un número' })
  @IsInt({ message: 'El número de capítulos debe ser un número entero' })
  @IsPositive({ message: 'El número de capítulos debe ser un número positivo' })
  chapters: number

  @IsString({ message: 'La fecha de lanzamiento debe ser un string' })
  @IsNotEmpty({ message: 'La fecha de lanzamiento es requerida' })
  @IsDateString(
    {},
    { message: 'La fecha de lanzamiento debe ser una fecha válida' },
  )
  releaseDate: string

  @ValidateNested()
  @Type(() => ImageDto)
  coverImage: ImageDto

  @ValidateNested()
  @Type(() => ImageDto)
  bannerImage: ImageDto

  @IsEnum(PublicationStatus, {
    message: 'El estado de publicación debe ser un valor válido',
  })
  publicationStatus: PublicationStatus

  @IsArray({ message: 'El campo autores debe ser un array' })
  @ArrayMinSize(1, { message: 'Debe proporcionar al menos un autor' })
  @ValidateNested({ each: true })
  @Type(() => SaveMangaAuthorDto)
  authors: SaveMangaAuthorDto[]

  @IsArray({ message: 'El campo géneros debe ser un array' })
  @ArrayMinSize(1, { message: 'Debe proporcionar al menos un género' })
  @ValidateNested({ each: true })
  @Type(() => SaveMangaGenreDto)
  genres: SaveMangaGenreDto[]

  @ValidateNested()
  @Type(() => SaveMangaDemographicDto)
  demographic: SaveMangaDemographicDto
}
