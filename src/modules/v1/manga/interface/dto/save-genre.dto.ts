import { z } from 'zod'

export const saveGenreSchema = z.object({
  name: z
    .string({
      required_error: 'El nombre del autor es requerido',
    })
    .min(3, {
      message: 'El nombre del autor debe tener al menos 3 caracteres',
    }),
})

export type SaveGenreDto = z.infer<typeof saveGenreSchema>
