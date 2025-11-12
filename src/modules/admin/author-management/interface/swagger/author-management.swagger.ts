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
              ],
            },
          },
        },
      },
    },
  },
}
