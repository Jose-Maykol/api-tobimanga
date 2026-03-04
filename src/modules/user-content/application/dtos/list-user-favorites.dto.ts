import { Type } from 'class-transformer'
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator'

export class ListUserFavoritesDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'page debe ser un número entero' })
  @Min(1, { message: 'page debe ser un número positivo' })
  page?: number = 1

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'pageSize debe ser un número entero' })
  @Min(1, { message: 'pageSize debe ser un número positivo' })
  @Max(100, { message: 'pageSize no puede ser mayor a 100' })
  pageSize?: number = 20

  @IsOptional()
  @IsEnum(['favoritedAt', 'title', 'rating'], {
    message: 'sortBy debe ser favoritedAt, title o rating',
  })
  sortBy?: 'favoritedAt' | 'title' | 'rating'

  @IsOptional()
  @IsEnum(['asc', 'desc'], { message: 'sortOrder debe ser asc o desc' })
  sortOrder?: 'asc' | 'desc'
}
