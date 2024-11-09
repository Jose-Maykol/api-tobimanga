import { z } from 'zod'

export const saveMangaAuthorsSchema = z.array(
  z.object({
    id: z.string({
      required_error: 'El campo id del autor es requerido',
      invalid_type_error: 'El campo id del autor debe ser un string',
    }),
  }),
  {
    required_error: 'Debe proporcionar al menos un autor',
    invalid_type_error: 'El campo autores debe ser un array',
  },
)

export type SaveMangaAuthorsDto = z.infer<typeof saveMangaAuthorsSchema>
