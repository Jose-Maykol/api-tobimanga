import { z } from 'zod'

export const createGenreSchema = z.object({
  name: z
    .string({
      required_error: 'El nombre del género es requerido',
    })
    .min(3, {
      message: 'El nombre del género debe tener al menos 3 caracteres',
    }),
})

export type CreateGenreDto = z.infer<typeof createGenreSchema>
