export const AuthorManagementSwagger = {
  create: {
    body: {
      description: 'Datos para la creación de un nuevo autor',
      type: 'CreateAuthorDto',
      examples: {
        validAuthor: {
          summary: 'Ejemplo válido para la creación de un autor',
          value: {
            name: 'Hajime Isayama',
          },
        },
      },
    },
    responses: {
      created: {
        status: 201,
        description: 'Autor creado exitosamente.',
        schema: {
          example: {
            success: true,
            message: 'Autor creado exitosamente',
            data: {
              author: {
                id: 'author-uuid-1',
                name: 'Hajime Isayama',
              },
            },
          },
        },
      },
      conflict: {
        status: 409,
        description: 'El autor ya existe.',
        schema: {
          example: {
            success: false,
            message: 'El autor ya existe',
            code: 'AUTHOR_ALREADY_EXISTS',
            statusCode: 409,
          },
        },
      },
      badRequest: {
        status: 400,
        description:
          'Datos de entrada inválidos. El nombre del autor es requerido y debe ser una cadena de texto.',
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
        description: 'Autores obtenidos exitosamente.',
        schema: {
          example: {
            success: true,
            message: 'Autores obtenidos exitosamente',
            data: {
              authors: [
                { id: 'author-uuid-1', name: 'Hajime Isayama' },
                { id: 'author-uuid-2', name: 'Eiichiro Oda' },
                { id: 'author-uuid-3', name: 'Kentaro Miura' },
                { id: 'author-uuid-4', name: 'Masashi Kishimoto' },
                { id: 'author-uuid-5', name: 'Akira Toriyama' },
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
      description: 'ID del autor a actualizar',
      example: 'author-uuid-1',
    },
    body: {
      description:
        'Datos para actualización del autor. El nombre debe tener entre 3 y 100 caracteres.',
      type: 'UpdateAuthorDto',
      examples: {
        validUpdate: {
          summary: 'Actualización válida de un autor',
          value: {
            name: 'Hajime Isayama (Mangaka)',
          },
        },
      },
    },
    responses: {
      success: {
        status: 200,
        description: 'Autor actualizado exitosamente.',
        schema: {
          example: {
            success: true,
            message: 'Autor actualizado exitosamente',
            data: {
              author: {
                id: 'author-uuid-1',
                name: 'Hajime Isayama (Mangaka)',
              },
            },
          },
        },
      },
      notFound: {
        status: 404,
        description: 'Autor no encontrado con el ID proporcionado.',
        schema: {
          example: {
            statusCode: 404,
            message: 'Author not found',
            error: 'AUTHOR_NOT_FOUND',
          },
        },
      },
      conflict: {
        status: 409,
        description: 'El nuevo nombre del autor ya existe en otro autor.',
        schema: {
          example: {
            statusCode: 409,
            message: 'Author already exists',
            error: 'AUTHOR_ALREADY_EXISTS',
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
