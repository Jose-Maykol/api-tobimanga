import { PublicationStatus } from '@/modules/v1/shared/enums/publication-status.enum'
import { z } from 'zod'

export const saveMangaSchema = z.object({
  originalName: z
    .string({
      required_error: 'El nombre original es requerido',
    })
    .min(3, {
      message: 'El nombre original debe tener al menos 3 caracteres',
    }),
  alternativesNames: z
    .array(
      z.string({
        required_error: 'El nombre alternativo es requerido',
      }),
    )
    .optional(),
  sinopsis: z
    .string({
      required_error: 'La sinopsis es requerida',
    })
    .min(10, {
      message: 'La sinopsis debe tener al menos 10 caracteres',
    }),
  chapters: z
    .number({
      required_error: 'El número de capítulos es requerido',
    })
    .int({
      message: 'El número de capítulos debe ser un número entero',
    })
    .positive({
      message: 'El número de capítulos debe ser un número positivo',
    }),
  releaseDate: z
    .string({
      required_error: 'La fecha de lanzamiento es requerida',
    })
    .refine((value) => !isNaN(Date.parse(value)), {
      message: 'La fecha de lanzamiento debe ser una fecha válida',
    }),
  coverImage: z.object({
    contentType: z
      .string({
        required_error: 'El tipo de contenido es requerido',
      })
      .regex(/^image\/(png|jpeg|jpg|webp)$/),
    data: z
      .string({
        required_error: 'La imagen de portada es requerida',
      })
      .base64(),
  }),
  bannerImage: z.object({
    contentType: z
      .string({
        required_error: 'El tipo de contenido es requerido',
      })
      .regex(/^image\/(png|jpeg|jpg|webp)$/),
    data: z
      .string({
        required_error: 'La imagen de banner es requerida',
      })
      .base64(),
  }),
  publicationStatus: z.nativeEnum(PublicationStatus),
})

export type SaveMangaDto = z.infer<typeof saveMangaSchema>

/* export type SaveMangaDto = Omit<
  z.infer<typeof saveMangaSchema>,
  'coverImage' | 'bannerImage'
> & {
  coverImage: ImageData
  bannerImage: ImageData
} */
