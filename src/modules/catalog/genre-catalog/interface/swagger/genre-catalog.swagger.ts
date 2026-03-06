export const GenreCatalogSwagger = {
  listGenres: {
    responses: {
      success: {
        status: 200,
        description: 'Lista de géneros obtenida exitosamente.',
        schema: {
          example: {
            success: true,
            message: 'Operación exitosa',
            data: [
              {
                id: 'genre-uuid-1',
                name: 'Acción',
              },
              {
                id: 'genre-uuid-2',
                name: 'Aventura',
              },
            ],
          },
        },
      },
    },
  },
}
