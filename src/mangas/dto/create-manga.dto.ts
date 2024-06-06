import { IsString, IsBoolean, IsInt, IsOptional, IsUrl } from 'class-validator'

export class CreateMangaDto {
  @IsString()
  title: string

  @IsString()
  description: string

  @IsInt()
  chapters: number

  @IsOptional()
  @IsInt()
  release_year?: number

  @IsOptional()
  @IsUrl()
  image_url?: string

  @IsBoolean()
  finalized: boolean

  @IsInt()
  rating: number
}
