export const MangaCatalogSwagger = {
  listMangas: {
    queries: {
      page: {
        name: 'page',
        required: false,
        type: Number,
        description: 'Número de página (por defecto: 1)',
        example: 1,
      },
      limit: {
        name: 'limit',
        required: false,
        type: Number,
        description: 'Cantidad de items por página (por defecto: 10)',
        example: 10,
      },
      search: {
        name: 'search',
        required: false,
        type: String,
        description: 'Buscar por nombre del manga',
        example: 'Attack on Titan',
      },
      genreId: {
        name: 'genreId',
        required: false,
        type: String,
        description: 'Filtrar por ID de género',
        example: 'uuid-del-genero',
      },
      authorId: {
        name: 'authorId',
        required: false,
        type: String,
        description: 'Filtrar por ID de autor',
        example: 'uuid-del-autor',
      },
      rating: {
        name: 'rating',
        required: false,
        type: Number,
        description: 'Filtrar por calificación mínima (1-5)',
        example: 4,
      },
    },
    responses: {
      success: {
        status: 200,
        description:
          'Lista de mangas públicos obtenida exitosamente. Solo incluye mangas activos con campos optimizados para el frontend.',
        schema: {
          example: {
            data: [
              {
                id: '880e8400-e29b-41d4-a716-446655440001',
                originalName: 'Attack on Titan',
                chapters: 139,
                releaseDate: '2009-09-09',
                coverImage:
                  'https://storage.example.com/uploads/cover-12345.jpg',
                rating: 95,
                genres: [
                  {
                    id: '660e8400-e29b-41d4-a716-446655440001',
                    name: 'Action',
                  },
                  {
                    id: '660e8400-e29b-41d4-a716-446655440002',
                    name: 'Drama',
                  },
                ],
                demographic: {
                  id: '770e8400-e29b-41d4-a716-446655440001',
                  name: 'Shounen',
                },
              },
            ],
            meta: {
              pagination: {
                page: 1,
                limit: 10,
                totalItems: 100,
                totalPages: 10,
              },
            },
          },
        },
      },
    },
  },
  getMangaBySlug: {
    param: {
      name: 'slug',
      type: String,
      description: 'Slug del manga a consultar',
      example: 'attack-on-titan',
    },
    responses: {
      success: {
        status: 200,
        description:
          'Detalle completo del manga obtenido exitosamente. Incluye toda la información necesaria para la página de detalle.',
        schema: {
          example: {
            data: {
              id: '880e8400-e29b-41d4-a716-446655440001',
              originalName: 'Attack on Titan',
              slugName: 'attack-on-titan',
              sinopsis:
                'In a world where humanity lives inside cities surrounded by enormous walls as a defense against the Titans...',
              chapters: 139,
              releaseDate: '2009-09-09',
              bannerImage:
                'https://storage.example.com/uploads/banner-12345.jpg',
              rating: 95,
              publicationStatus: 'FINISHED',
              authors: [
                {
                  id: '550e8400-e29b-41d4-a716-446655440001',
                  name: 'Hajime Isayama',
                },
              ],
              genres: [
                {
                  id: '660e8400-e29b-41d4-a716-446655440001',
                  name: 'Action',
                },
                {
                  id: '660e8400-e29b-41d4-a716-446655440002',
                  name: 'Drama',
                },
              ],
              demographic: {
                id: '770e8400-e29b-41d4-a716-446655440001',
                name: 'Shounen',
              },
            },
          },
        },
      },
      notFound: {
        status: 404,
        description: 'Manga no encontrado con el slug proporcionado.',
        schema: {
          example: {
            statusCode: 404,
            message: 'Manga no encontrado',
            error: 'MANGA_NOT_FOUND',
          },
        },
      },
    },
  },
  listChapters: {
    queries: {
      page: {
        name: 'page',
        required: false,
        type: Number,
        description: 'Número de página (por defecto: 1)',
        example: 1,
      },
      limit: {
        name: 'limit',
        required: false,
        type: Number,
        description: 'Cantidad de capítulos por página (por defecto: 20)',
        example: 20,
      },
      order: {
        name: 'order',
        required: false,
        enum: ['ASC', 'DESC'],
        description:
          'Orden de los capítulos por número (ASC: ascendente, DESC: descendente). Por defecto: DESC',
        example: 'DESC',
      },
    },
    responses: {
      success: {
        status: 200,
        description:
          'Lista de capítulos obtenida exitosamente. Incluye paginación y ordenamiento.',
        schema: {
          example: {
            data: [
              {
                id: '123e4567-e89b-12d3-a456-426614174000',
                chapterNumber: 139,
                title: 'Available',
                releaseDate: '2021-04-09',
              },
              {
                id: '123e4567-e89b-12d3-a456-426614174001',
                chapterNumber: 138,
                title: 'A Long Dream',
                releaseDate: '2021-03-09',
              },
            ],
            meta: {
              pagination: {
                page: 1,
                limit: 20,
                totalItems: 139,
                totalPages: 7,
              },
            },
          },
        },
      },
    },
  },
}
