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
}
