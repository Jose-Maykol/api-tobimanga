import { IsEnum, IsNumber, IsOptional, Min } from 'class-validator'

export class ListUserChaptersDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number = 1

  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number = 20

  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC' = 'DESC'
}
