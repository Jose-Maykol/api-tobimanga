export const GenreManagementSwagger = {
  create: {
    body: {
      description: 'Datos para la creación de un nuevo género',
      type: 'CreateGenreDto',
      examples: {
        validGenre: {
          summary: 'Ejemplo válido para la creación de un género',
          value: {
            name: 'Action',
          },
        },
      },
    },
    responses: {
      created: {
        status: 201,
        description: 'Género creado exitosamente.',
        schema: {
          example: {
            success: true,
            message: 'Género creado exitosamente',
            data: {
              genre: {
                id: 'genre-uuid-1',
                name: 'Action',
              },
            },
          },
        },
      },
      conflict: {
        status: 409,
        description: 'El género ya existe.',
        schema: {
          example: {
            success: false,
            message: 'El género ya existe',
            code: 'GENRE_ALREADY_EXISTS',
            statusCode: 409,
          },
        },
      },
    },
  },
  getAll: {
    responses: {
      ok: {
        status: 200,
        description: 'Géneros obtenidos exitosamente.',
        schema: {
          example: {
            success: true,
            message: 'Géneros obtenidos exitosamente',
            data: {
              genres: [
                { id: 'genre-uuid-1', name: 'Action' },
                { id: 'genre-uuid-2', name: 'Adventure' },
              ],
            },
          },
        },
      },
    },
  },
}
