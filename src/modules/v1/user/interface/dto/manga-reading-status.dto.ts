/* eslint-disable @typescript-eslint/no-unused-vars */
import { z } from 'zod'
import { MangaReadingStatus } from '../../domain/enums/manga-reading-status.enum'

export const mangaReadingStatus = z.nativeEnum(MangaReadingStatus, {
  errorMap: (issue, _ctx) => {
    return {
      message: 'El estado de lectura del manga es inválido',
    }
  },
})
