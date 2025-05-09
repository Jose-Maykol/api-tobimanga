import { ApiProperty } from '@nestjs/swagger'
import { z } from 'zod'

export const createCronJobSchema = z.object({
  name: z
    .string({
      required_error: 'El nombre del trabajo cron es requerido',
    })
    .min(3, {
      message: 'El nombre del trabajo cron debe tener al menos 3 caracteres',
    }),
  schedule: z
    .string({
      required_error: 'La programación del trabajo cron es requerida',
    })
    .min(3, {
      message:
        'La programación del trabajo cron debe tener al menos 3 caracteres',
    }),
  task: z
    .string({
      required_error: 'La tarea del trabajo cron es requerida',
    })
    .min(3, {
      message: 'La tarea del trabajo cron debe tener al menos 3 caracteres',
    }),
  isActive: z.boolean().optional(),
})

export type CreateCronJobDto = z.infer<typeof createCronJobSchema>

export class CreateCronJobSwaggerDto {
  @ApiProperty({
    description: 'Nombre del trabajo cron',
    example: 'Actualizar precios',
    minLength: 3,
  })
  name: string
  @ApiProperty({
    description: 'Programación del trabajo cron',
    example: '0 0 * * *',
    minLength: 3,
  })
  schedule: string
  @ApiProperty({
    description: 'Tarea del trabajo cron',
    example: 'actualizar_precios',
    minLength: 3,
  })
  task: string
  @ApiProperty({
    description: 'Estado del trabajo cron',
    example: true,
  })
  isActive?: boolean
}
