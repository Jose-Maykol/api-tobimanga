export const MangaManagementSwagger = {
  create: {
    body: {
      description:
        'Datos para la creación de un nuevo manga. Incluye información básica, imágenes (URLs de uploads previos), autores, géneros y demografía.',
      type: 'CreateMangaDto',
      examples: {
        validManga: {
          summary: 'Ejemplo válido para la creación de un manga',
          value: {
            originalName: 'Attack on Titan',
            alternativeNames: ['Shingeki no Kyojin', '進撃の巨人'],
            sinopsis:
              'In a world where humanity lives inside cities surrounded by enormous walls as a defense against the Titans...',
            chapters: 139,
            releaseDate: '2009-09-09',
            coverImage: 'https://storage.example.com/uploads/cover-12345.jpg',
            bannerImage: 'https://storage.example.com/uploads/banner-12345.jpg',
            publicationStatus: 'FINISHED',
            authors: [
              { id: '550e8400-e29b-41d4-a716-446655440001' },
              { id: '550e8400-e29b-41d4-a716-446655440002' },
            ],
            genres: [
              { id: '660e8400-e29b-41d4-a716-446655440001' },
              { id: '660e8400-e29b-41d4-a716-446655440002' },
            ],
            demographic: { id: '770e8400-e29b-41d4-a716-446655440001' },
          },
        },
      },
    },
    responses: {
      created: {
        status: 201,
        description:
          'Manga creado exitosamente. El use case también crea automáticamente los capítulos especificados y activa los uploads de las imágenes.',
        schema: {
          example: {
            message: 'Manga creado exitosamente',
            data: {
              id: '880e8400-e29b-41d4-a716-446655440001',
              originalName: 'Attack on Titan',
              slugName: 'attack-on-titan',
              scrappingName: 'attack-on-titan',
              alternativeNames: ['Shingeki no Kyojin', '進撃の巨人'],
              sinopsis:
                'In a world where humanity lives inside cities surrounded by enormous walls...',
              chapters: 139,
              releaseDate: '2009-09-09T00:00:00.000Z',
              coverImage: 'https://storage.example.com/uploads/cover-12345.jpg',
              bannerImage:
                'https://storage.example.com/uploads/banner-12345.jpg',
              publicationStatus: 'FINISHED',
              rating: 0,
              active: true,
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
              ],
              demographic: {
                id: '770e8400-e29b-41d4-a716-446655440001',
                name: 'Shounen',
              },
              createdAt: '2024-01-01T00:00:00.000Z',
              updatedAt: null,
            },
          },
        },
      },
      conflict: {
        status: 409,
        description:
          'El manga ya existe. Se valida por slugName generado a partir del originalName.',
        schema: {
          example: {
            statusCode: 409,
            message: 'Manga already exists',
            error: 'MANGA_ALREADY_EXISTS',
          },
        },
      },
      badRequest: {
        status: 400,
        description:
          'Datos de entrada inválidos. Validaciones incluyen: mínimo 3 caracteres en originalName, mínimo 10 en sinopsis, al menos 1 autor y 1 género, URLs válidas para imágenes.',
        schema: {
          example: {
            statusCode: 400,
            message: [
              'El nombre original debe tener al menos 3 caracteres',
              'La sinopsis debe tener al menos 10 caracteres',
              'Debe proporcionar al menos un autor',
            ],
            error: 'Bad Request',
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
  update: {
    param: {
      name: 'id',
      type: String,
      description: 'ID del manga a actualizar',
      example: '880e8400-e29b-41d4-a716-446655440001',
    },
    body: {
      description:
        'Datos para actualización del manga. IMPORTANTE: El campo "chapters" NO se actualiza (se mantiene el valor existente). El scrappingName tampoco se modifica.',
      type: 'UpdateMangaDto',
      examples: {
        validUpdate: {
          summary: 'Actualización válida de un manga',
          value: {
            originalName: 'Attack on Titan - Final Season',
            alternativeNames: ['Shingeki no Kyojin', '進撃の巨人', 'AoT'],
            sinopsis:
              'Updated synopsis with more details about the final season...',
            chapters: 139,
            releaseDate: '2009-09-09',
            coverImage: 'https://storage.example.com/uploads/new-cover.jpg',
            bannerImage: 'https://storage.example.com/uploads/new-banner.jpg',
            publicationStatus: 'FINISHED',
            authors: [{ id: '550e8400-e29b-41d4-a716-446655440001' }],
            genres: [
              { id: '660e8400-e29b-41d4-a716-446655440001' },
              { id: '660e8400-e29b-41d4-a716-446655440003' },
            ],
            demographic: { id: '770e8400-e29b-41d4-a716-446655440001' },
          },
        },
      },
    },
    responses: {
      success: {
        status: 200,
        description:
          'Manga actualizado exitosamente. NOTA: El campo "chapters" NO se actualiza aunque se envíe en el body. Los uploads de imágenes se activan automáticamente.',
        schema: {
          example: {
            message: 'Manga actualizado exitosamente',
            data: {
              id: '880e8400-e29b-41d4-a716-446655440001',
              originalName: 'Attack on Titan - Final Season',
              slugName: 'attack-on-titan-final-season',
              scrappingName: 'attack-on-titan',
              alternativeNames: ['Shingeki no Kyojin', '進撃の巨人', 'AoT'],
              sinopsis: 'Updated synopsis with more details...',
              chapters: 139,
              releaseDate: '2009-09-09T00:00:00.000Z',
              coverImage: 'https://storage.example.com/uploads/new-cover.jpg',
              bannerImage: 'https://storage.example.com/uploads/new-banner.jpg',
              publicationStatus: 'FINISHED',
              rating: 95,
              active: true,
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
                { id: '660e8400-e29b-41d4-a716-446655440003', name: 'Drama' },
              ],
              demographic: {
                id: '770e8400-e29b-41d4-a716-446655440001',
                name: 'Shounen',
              },
              createdAt: '2024-01-01T00:00:00.000Z',
              updatedAt: '2024-06-15T10:30:00.000Z',
            },
          },
        },
      },
      notFound: {
        status: 404,
        description: 'Manga no encontrado con el ID proporcionado.',
        schema: {
          example: {
            statusCode: 404,
            message: 'Manga not found',
            error: 'MANGA_NOT_FOUND',
          },
        },
      },
      conflict: {
        status: 409,
        description:
          'El nuevo originalName genera un slugName que ya existe en otro manga.',
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
