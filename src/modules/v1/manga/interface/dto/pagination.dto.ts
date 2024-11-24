import { z } from 'zod'

export const paginationSchema = z.object({
  page: z
    .number({
      required_error: 'page es requerido',
    })
    .int({
      message: 'page debe ser un número entero',
    })
    .positive({
      message: 'page debe ser un número positivo',
    })
    .optional()
    .default(1),
  limit: z
    .number({
      required_error: 'limit es requerido',
    })
    .int({
      message: 'limit debe ser un número entero',
    })
    .positive({
      message: 'limit debe ser un número positivo',
    })
    .optional()
    .default(12),
})

export type PaginationDto = z.infer<typeof paginationSchema>
