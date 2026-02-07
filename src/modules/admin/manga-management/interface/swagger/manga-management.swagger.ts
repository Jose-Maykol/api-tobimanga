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
            message:
              'El manga con el nombre "Attack on Titan" ya se encuentra registrado',
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
  getMangaById: {
    param: {
      name: 'id',
      type: String,
      description: 'ID del manga a consultar',
      example: '880e8400-e29b-41d4-a716-446655440001',
    },
    responses: {
      success: {
        status: 200,
        description: 'Manga obtenido exitosamente con todos sus detalles.',
        schema: {
          example: {
            data: {
              id: '880e8400-e29b-41d4-a716-446655440001',
              originalName: 'Attack on Titan',
              slugName: 'attack-on-titan',
              scrappingName: 'attack-on-titan',
              alternativeNames: ['Shingeki no Kyojin', '進撃の巨人'],
              sinopsis:
                'In a world where humanity lives inside cities surrounded by enormous walls as a defense against the Titans...',
              chapters: 139,
              releaseDate: '2009-09-09T00:00:00.000Z',
              coverImage: 'https://storage.example.com/uploads/cover-12345.jpg',
              bannerImage:
                'https://storage.example.com/uploads/banner-12345.jpg',
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
                {
                  id: '660e8400-e29b-41d4-a716-446655440002',
                  name: 'Drama',
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
      notFound: {
        status: 404,
        description: 'Manga no encontrado con el ID proporcionado.',
        schema: {
          example: {
            statusCode: 404,
            message:
              'El manga con el identificador "880e8400-e29b-41d4-a716-446655440001" no fue encontrado',
            error: 'MANGA_NOT_FOUND',
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
            message:
              'El manga con el identificador "880e8400-e29b-41d4-a716-446655440001" no fue encontrado',
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
            message:
              'El manga con el nombre "Attack on Titan - Final Season" ya se encuentra registrado',
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
        description: 'Cantidad de capítulos por página (por defecto: 30)',
        example: 30,
      },
      order: {
        name: 'order',
        required: false,
        enum: ['asc', 'desc'],
        description:
          'Orden de los capítulos por número. "asc" ordena de menor a mayor, "desc" de mayor a menor (por defecto: desc)',
        examples: {
          ascending: {
            summary: 'Orden ascendente',
            value: 'asc',
          },
          descending: {
            summary: 'Orden descendente',
            value: 'desc',
          },
        },
      },
    },
    responses: {
      success: {
        status: 200,
        description: 'Lista de capítulos obtenida exitosamente con paginación.',
        schema: {
          example: {
            message: 'Capítulos obtenidos exitosamente',
            data: [
              {
                id: 'chapter-uuid-1',
                chapterNumber: 10,
                releaseDate: '2024-01-22',
                createdAt: '2024-01-01T00:00:00.000Z',
                updatedAt: null,
              },
              {
                id: 'chapter-uuid-2',
                chapterNumber: 9,
                releaseDate: '2024-01-15',
                createdAt: '2024-01-01T00:00:00.000Z',
                updatedAt: null,
              },
            ],
            meta: {
              pagination: {
                page: 1,
                limit: 30,
                totalItems: 139,
                totalPages: 5,
              },
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
            message:
              'El manga con el identificador "f7b3c1a0-1234-5678-9abc-def012345678" no fue encontrado',
            error: 'MANGA_NOT_FOUND',
          },
        },
      },
    },
  },
  createChapter: {
    param: {
      name: 'mangaId',
      type: String,
      description: 'ID del manga al que pertenece el capítulo',
      example: 'f7b3c1a0-1234-5678-9abc-def012345678',
    },
    body: {
      description:
        'Datos opcionales para la creación del capítulo. El sistema calcula automáticamente el siguiente número de capítulo (último + 1).',
      type: 'CreateChapterDto',
      examples: {
        withTitle: {
          summary: 'Capítulo con título',
          value: {
            title: 'El tesoro de los piratas',
            releaseDate: '2026-02-05',
          },
        },
        onlyTitle: {
          summary: 'Solo título',
          value: {
            title: 'La batalla final',
          },
        },
        empty: {
          summary: 'Sin datos (ambos opcionales)',
          value: {},
        },
      },
    },
    responses: {
      created: {
        status: 201,
        description:
          'Capítulo creado exitosamente. El número de capítulo se calcula automáticamente y el contador del manga se incrementa.',
        schema: {
          example: {
            message: 'Capítulo creado exitosamente',
            data: {
              id: 'chapter-uuid',
              mangaId: 'f7b3c1a0-1234-5678-9abc-def012345678',
              chapterNumber: 202,
              title: 'El tesoro de los piratas',
              releaseDate: '2026-02-05',
              createdAt: '2026-02-05T20:00:00.000Z',
              updatedAt: null,
            },
          },
        },
      },
      notFound: {
        status: 404,
        description: 'El manga con el ID proporcionado no existe.',
        schema: {
          example: {
            statusCode: 404,
            message:
              'El manga con el identificador "f7b3c1a0-1234-5678-9abc-def012345678" no fue encontrado',
            error: 'MANGA_NOT_FOUND',
          },
        },
      },
      conflict: {
        status: 409,
        description:
          'El capítulo calculado ya existe (caso muy raro, indica un problema de concurrencia).',
        schema: {
          example: {
            statusCode: 409,
            message: 'El capítulo 202 ya existe para este manga',
            error: 'chapter_already_exists',
          },
        },
      },
    },
  },
  updateChapterTitle: {
    paramManga: {
      name: 'mangaId',
      type: String,
      description: 'ID del manga',
      example: 'f7b3c1a0-1234-5678-9abc-def012345678',
    },
    paramChapter: {
      name: 'chapterId',
      type: String,
      description: 'ID del capítulo a actualizar',
      example: 'a1b2c3d4-5678-90ab-cdef-1234567890ab',
    },
    body: {
      description: 'Nuevo título para el capítulo.',
      type: 'UpdateChapterTitleDto',
      examples: {
        updateTitle: {
          summary: 'Actualizar título',
          value: {
            title: 'El gran tesoro escondido',
          },
        },
      },
    },
    responses: {
      success: {
        status: 200,
        description:
          'Título del capítulo actualizado exitosamente. El campo updatedAt se actualiza automáticamente.',
        schema: {
          example: {
            message: 'Título del capítulo actualizado exitosamente',
            data: {
              id: 'a1b2c3d4-5678-90ab-cdef-1234567890ab',
              mangaId: 'f7b3c1a0-1234-5678-9abc-def012345678',
              chapterNumber: 202,
              title: 'El gran tesoro escondido',
              releaseDate: '2026-02-05',
              createdAt: '2026-02-05T20:00:00.000Z',
              updatedAt: '2026-02-05T21:47:00.000Z',
            },
          },
        },
      },
      notFound: {
        status: 404,
        description: 'El manga o el capítulo no existe.',
        schema: {
          example: {
            statusCode: 404,
            message: 'Capítulo con ID xxx no encontrado',
            error: 'CHAPTER_NOT_FOUND',
          },
        },
      },
      badRequest: {
        status: 400,
        description:
          'El capítulo no pertenece al manga especificado o datos de entrada inválidos.',
        schema: {
          example: {
            statusCode: 400,
            message: 'El capítulo no pertenece a este manga',
            error: 'CHAPTER_DOES_NOT_BELONG_TO_MANGA',
          },
        },
      },
    },
  },
}
