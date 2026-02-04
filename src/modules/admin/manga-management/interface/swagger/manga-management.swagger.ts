export const MangaManagementSwagger = {
  create: {
    body: {
      description: 'Datos para la creación de un nuevo manga',
      type: 'CreateMangaDto',
      examples: {
        validManga: {
          summary: 'Ejemplo válido para la creación de un manga',
          value: {
            originalName: 'Attack on Titan',
            alternativeNames: ['Shingeki no Kyojin', '進撃の巨人'],
            sinopsis: 'A story about humanity fighting against titans.',
            chapters: 139,
            releaseDate: '2013-04-07',
            coverImage: {
              contentType: 'image/png',
              data: 'iVBORw0KGgoAAAANSUhEUgAA...',
            },
            bannerImage: {
              contentType: 'image/jpeg',
              data: '/9j/4AAQSkZJRgABAQAAAQABAAD...',
            },
            publicationStatus: 'ONGOING',
            authors: [{ id: 'author-uuid-1' }, { id: 'author-uuid-2' }],
            genres: [{ id: 'genre-uuid-1' }, { id: 'genre-uuid-2' }],
            demographic: { id: 'demographic-uuid' },
          },
        },
      },
    },
    responses: {
      created: {
        status: 201,
        description: 'Manga creado exitosamente.',
        schema: {
          example: {
            message: 'Manga creado exitosamente',
            data: {
              manga: {
                id: 'manga-uuid',
                originalName: 'Attack on Titan',
                alternativeNames: ['Shingeki no Kyojin', '進撃の巨人'],
                sinopsis: 'A story about humanity fighting against titans.',
                chapters: 139,
                releaseDate: '2013-04-07',
                coverImage: {
                  contentType: 'image/png',
                  data: 'iVBORw0KGgoAAAANSUhEUgAA...',
                },
                bannerImage: {
                  contentType: 'image/jpeg',
                  data: '/9j/4AAQSkZJRgABAQAAAQABAAD...',
                },
                publicationStatus: 'ONGOING',
                authors: [{ id: 'author-uuid-1' }, { id: 'author-uuid-2' }],
                genres: [{ id: 'genre-uuid-1' }, { id: 'genre-uuid-2' }],
                demographic: { id: 'demographic-uuid' },
              },
            },
          },
        },
      },
      conflict: {
        status: 409,
        description: 'El manga ya existe.',
        schema: {
          example: {
            statusCode: 409,
            message: 'Manga already exists',
            error: 'MANGA_ALREADY_EXISTS',
          },
        },
      },
    },
  },
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
      publicationStatus: {
        name: 'publicationStatus',
        required: false,
        enum: [
          'ONGOING',
          'FINISHED',
          'HIATUS',
          'CANCELLED',
          'NOT_YET_RELEASED',
          'UNKNOWN',
        ],
        description:
          'Filtrar por estado de publicación. Si no se especifica, devuelve todos los mangas.',
        examples: {
          ongoing: {
            summary: 'Mangas en curso',
            value: 'ONGOING',
          },
          finished: {
            summary: 'Mangas finalizados',
            value: 'FINISHED',
          },
        },
      },
    },
    responses: {
      success: {
        status: 200,
        description: 'Lista de mangas obtenida exitosamente.',
        schema: {
          example: {
            data: [
              {
                id: 'manga-uuid',
                originalName: 'Attack on Titan',
                slugName: 'attack-on-titan',
                chapters: 139,
                publicationStatus: 'FINISHED',
                rating: 95,
                coverImage: 'https://example.com/cover.jpg',
                active: true,
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
  listChapters: {
    param: {
      name: 'mangaId',
      type: String,
      description: 'ID del manga',
      example: 'f7b3c1a0-1234-5678-9abc-def012345678',
    },
    responses: {
      success: {
        status: 200,
        description: 'Lista de capítulos obtenida exitosamente.',
        schema: {
          example: {
            message: 'Capítulos obtenidos exitosamente',
            data: {
              chapters: [
                {
                  id: 'chapter-uuid-1',
                  chapterNumber: 1,
                  releaseDate: '2024-01-15',
                  createdAt: '2024-01-01T00:00:00.000Z',
                  updatedAt: null,
                },
                {
                  id: 'chapter-uuid-2',
                  chapterNumber: 2,
                  releaseDate: '2024-01-22',
                  createdAt: '2024-01-01T00:00:00.000Z',
                  updatedAt: null,
                },
              ],
            },
          },
        },
      },
      notFound: {
        status: 404,
        description: 'Manga no encontrado.',
        schema: {
          example: {
            statusCode: 404,
            message: 'Manga not found',
            error: 'MANGA_NOT_FOUND',
          },
        },
      },
    },
  },
}
