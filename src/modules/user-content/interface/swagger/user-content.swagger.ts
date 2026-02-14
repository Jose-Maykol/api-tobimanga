import { ReadingStatus } from '../../domain/value-objects/reading-status.vo'

export const UserContentSwagger = {
  followManga: {
    body: {
      description: 'Datos para seguir un manga',
      type: 'FollowMangaDto',
      examples: {
        validFollow: {
          summary: 'Ejemplo válido para seguir un manga',
          value: {
            mangaId: 'manga-uuid-1234',
            initialStatus: ReadingStatus.PLANNING_TO_READ,
          },
        },
      },
    },
    responses: {
      created: {
        status: 201,
        description: 'Manga seguido exitosamente.',
        schema: {
          example: {
            success: true,
            message: 'Manga seguido exitosamente',
            data: {
              userManga: {
                id: 'user-manga-uuid-1',
                userId: 'user-uuid-1',
                mangaId: 'manga-uuid-1234',
                readingStatus: 'PLANNING_TO_READ',
                rating: null,
                createdAt: '2023-10-27T10:00:00Z',
              },
            },
          },
        },
      },
      badRequest: {
        status: 400,
        description: 'Datos de entrada inválidos.',
        schema: {
          example: {
            statusCode: 400,
            message: ['mangaId must be a UUID'],
            error: 'Bad Request',
          },
        },
      },
    },
  },
  updateReadingStatus: {
    param: {
      name: 'mangaId',
      type: String,
      description: 'ID del manga a actualizar',
      example: 'manga-uuid-1234',
    },
    body: {
      description: 'Nuevo estado de lectura',
      type: 'UpdateReadingStatusDto',
      examples: {
        validUpdate: {
          summary: 'Actualización a LEYENDO',
          value: {
            status: ReadingStatus.READING,
          },
        },
        completed: {
          summary: 'Actualización a COMPLETADO',
          value: {
            status: ReadingStatus.COMPLETED,
          },
        },
      },
    },
    responses: {
      success: {
        status: 200,
        description: 'Estado de lectura actualizado exitosamente.',
        schema: {
          example: {
            success: true,
            message: 'Estado de lectura actualizado exitosamente',
            data: {
              userManga: {
                id: 'user-manga-uuid-1',
                userId: 'user-uuid-1',
                mangaId: 'manga-uuid-1234',
                readingStatus: 'READING',
                updatedAt: '2023-10-27T10:30:00Z',
              },
            },
          },
        },
      },
      notFound: {
        status: 404,
        description: 'El usuario no sigue este manga.',
        schema: {
          example: {
            statusCode: 404,
            message:
              'No estás siguiendo el manga con el identificador "manga-uuid-1234"',
            error: 'MANGA_NOT_FOLLOWED',
          },
        },
      },
      badRequest: {
        status: 400,
        description: 'Datos de entrada inválidos.',
        schema: {
          example: {
            statusCode: 400,
            message: [
              'status must be one of the following values: READING, COMPLETED, ...',
            ],
            error: 'Bad Request',
          },
        },
      },
    },
  },
  addFavorite: {
    param: {
      name: 'mangaId',
      type: String,
      description: 'ID de manga a marcar como favorito',
      example: 'manga-uuid-1234',
    },
    responses: {
      created: {
        status: 201,
        description: 'Manga marcado como favorito exitosamente.',
        schema: {
          example: {
            success: true,
            message: 'Manga marcado como favorito exitosamente',
            data: {
              userManga: {
                id: 'user-manga-uuid-1',
                userId: 'user-uuid-1',
                mangaId: 'manga-uuid-1234',
                readingStatus: 'READING',
                isFavorite: true,
                updatedAt: '2023-10-27T10:30:00Z',
              },
            },
          },
        },
      },
      notFound: {
        status: 404,
        description: 'El usuario no sigue este manga.',
        schema: {
          example: {
            statusCode: 404,
            message:
              'No estás siguiendo el manga con el identificador "manga-uuid-1234"',
            error: 'MANGA_NOT_FOLLOWED',
          },
        },
      },
    },
  },
  removeFavorite: {
    param: {
      name: 'mangaId',
      type: String,
      description: 'ID de manga a desmarcar como favorito',
      example: 'manga-uuid-1234',
    },
    responses: {
      success: {
        status: 200,
        description: 'Manga desmarcado como favorito exitosamente.',
        schema: {
          example: {
            success: true,
            message: 'Manga desmarcado como favorito exitosamente',
            data: {
              userManga: {
                id: 'user-manga-uuid-1',
                userId: 'user-uuid-1',
                mangaId: 'manga-uuid-1234',
                readingStatus: 'READING',
                isFavorite: false,
                updatedAt: '2023-10-27T10:45:00Z',
              },
            },
          },
        },
      },
      notFound: {
        status: 404,
        description: 'El usuario no sigue este manga.',
        schema: {
          example: {
            statusCode: 404,
            message:
              'No estás siguiendo el manga con el identificador "manga-uuid-1234"',
            error: 'MANGA_NOT_FOLLOWED',
          },
        },
      },
    },
  },
}
