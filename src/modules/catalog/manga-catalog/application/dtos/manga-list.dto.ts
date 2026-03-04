import { Type } from 'class-transformer'
import { IsNumber, IsOptional, IsString } from 'class-validator'

import { PaginationDto } from '@/common/dto/pagination.dto'

export interface MangaListItemDto {
  id: string
  originalName: string
  chapters: number
  releaseDate: Date
  coverImage: string
  rating: number
  genres: { id: string; name: string }[]
  demographic: { id: string; name: string }
}

export interface MangaDetailDto {
  id: string
  originalName: string
  slugName: string
  sinopsis: string
  chapters: number
  releaseDate: Date
  bannerImage: string
  coverImage: string
  rating: number
  publicationStatus: string
  authors: { id: string; name: string }[]
  genres: { id: string; name: string }[]
  demographic: { id: string; name: string }
}

export class ListPublicMangasDto extends PaginationDto {
  @IsOptional()
  @IsString({ message: 'genreId debe ser un string' })
  genreId?: string

  @IsOptional()
  @IsString({ message: 'authorId debe ser un string' })
  authorId?: string

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'rating debe ser un número' })
  rating?: number

  @IsOptional()
  @IsString({ message: 'search debe ser un string' })
  search?: string
}
