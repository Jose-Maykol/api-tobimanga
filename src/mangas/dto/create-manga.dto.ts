import { PublicationStatus } from '@/models/manga.entity'
import { z } from 'zod'

export const createMangaSchema = z.object({
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
  authors: z.array(z.string()),
  demographic: z.string(),
  genres: z.array(
    z.string({
      message: 'El género debe ser un string',
    }),
  ),
})

interface ImageData {
  contentType: string
  data: string
}

export type CreateMangaDto = Omit<
  z.infer<typeof createMangaSchema>,
  'coverImage' | 'bannerImage'
> & {
  coverImage: ImageData
  bannerImage: ImageData
}
