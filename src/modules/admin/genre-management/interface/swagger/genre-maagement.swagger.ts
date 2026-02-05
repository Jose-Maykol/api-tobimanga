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
      badRequest: {
        status: 400,
        description:
          'Datos de entrada inválidos. El nombre del género es requerido y debe ser una cadena de texto.',
        schema: {
          example: {
            statusCode: 400,
            message: ['name must be a string', 'name should not be empty'],
            error: 'Bad Request',
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
                { id: 'genre-uuid-3', name: 'Comedy' },
                { id: 'genre-uuid-4', name: 'Drama' },
                { id: 'genre-uuid-5', name: 'Fantasy' },
              ],
            },
          },
        },
      },
    },
  },
  update: {
    param: {
      name: 'id',
      type: String,
      description: 'ID del género a actualizar',
      example: 'genre-uuid-1',
    },
    body: {
      description:
        'Datos para actualización del género. El nombre debe tener entre 3 y 100 caracteres.',
      type: 'UpdateGenreDto',
      examples: {
        validUpdate: {
          summary: 'Actualización válida de un género',
          value: {
            name: 'Action & Adventure',
          },
        },
      },
    },
    responses: {
      success: {
        status: 200,
        description: 'Género actualizado exitosamente.',
        schema: {
          example: {
            success: true,
            message: 'Género actualizado exitosamente',
            data: {
              genre: {
                id: 'genre-uuid-1',
                name: 'Action & Adventure',
              },
            },
          },
        },
      },
      notFound: {
        status: 404,
        description: 'Género no encontrado con el ID proporcionado.',
        schema: {
          example: {
            statusCode: 404,
            message: 'Genre not found',
            error: 'GENRE_NOT_FOUND',
          },
        },
      },
      conflict: {
        status: 409,
        description: 'El nuevo nombre del género ya existe en otro género.',
        schema: {
          example: {
            statusCode: 409,
            message: 'Genre already exists',
            error: 'GENRE_ALREADY_EXISTS',
          },
        },
      },
      badRequest: {
        status: 400,
        description:
          'Datos de entrada inválidos. El nombre debe tener entre 3 y 100 caracteres.',
        schema: {
          example: {
            statusCode: 400,
            message: [
              'name must be longer than or equal to 3 characters',
              'name must be a string',
            ],
            error: 'Bad Request',
          },
        },
      },
    },
  },
}
