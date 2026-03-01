import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator'

import { CronJobKey } from '../../domain/enums/cron-job-key.enum'

export class CreateCronJobDto {
  @IsEnum(CronJobKey, {
    message: `key must be one of the following registered processes: ${Object.values(CronJobKey).join(', ')}`,
  })
  key: CronJobKey

  @IsString()
  @IsNotEmpty()
  @Length(1, 200)
  name: string

  @IsString()
  @IsOptional()
  @Length(0, 500)
  description?: string

  @IsString()
  @IsNotEmpty()
  schedule: string

  @IsBoolean()
  @IsOptional()
  isActive?: boolean
}
