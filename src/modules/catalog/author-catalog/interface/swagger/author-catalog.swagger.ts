export const AuthorCatalogSwagger = {
  listAuthors: {
    responses: {
      success: {
        status: 200,
        description: 'Lista de autores obtenida exitosamente.',
        schema: {
          example: {
            success: true,
            message: 'Operación exitosa',
            data: [
              {
                id: 'author-uuid-1',
                name: 'Eiichiro Oda',
              },
              {
                id: 'author-uuid-2',
                name: 'Akira Toriyama',
              },
            ],
          },
        },
      },
    },
  },
}
