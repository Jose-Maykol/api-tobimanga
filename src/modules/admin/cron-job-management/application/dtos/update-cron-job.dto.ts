import { IsBoolean, IsOptional, IsString, Length } from 'class-validator'

export class UpdateCronJobDto {
  @IsString()
  @IsOptional()
  @Length(1, 200)
  name?: string

  @IsString()
  @IsOptional()
  @Length(0, 500)
  description?: string

  @IsString()
  @IsOptional()
  schedule?: string

  @IsBoolean()
  @IsOptional()
  isActive?: boolean
}
