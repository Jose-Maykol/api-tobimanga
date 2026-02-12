import slugify from 'slugify'

import { Inject, Injectable, Logger } from '@nestjs/common'

// Manga entity import removed
import { MangaAlreadyExistsException } from '@/core/domain/exceptions/manga/manga-already-exists.exception'
import { GetAuthorByIdUseCase } from '@/modules/admin/author-management/application/use-cases/get-author-by-id.use-case'
import { GetDemographicByIdUseCase } from '@/modules/admin/demographic-management/application/use-cases/get-demographic-by-id.use-case'
import { GetGenreByIdUseCase } from '@/modules/admin/genre-management/application/use-cases/get-genre-by-id.use-case'
import { CreateMangaDto } from '@/modules/admin/manga-management/application/dtos/create-manga.dto'
import { FindUploadByUrlUseCase } from '@/modules/admin/upload/application/use-cases/find-upload-by-url.use-case'
import { UpdateUploadStatusUseCase } from '@/modules/admin/upload/application/use-cases/update-upload-status.use-case'
import { UploadStatus } from '@/modules/admin/upload/domain/entities/upload.entity'

import { MangaFactory } from '../../domain/factories/manga.factory'
import { ChapterRepository } from '../../domain/repositories/chapter.repository'
import { MangaRepository } from '../../domain/repositories/manga.repository'
import {
  CHAPTER_REPOSITORY,
  MANGA_REPOSITORY,
} from '../../infrastructure/tokens'

@Injectable()
export class CreateMangaUseCase {
  private readonly logger = new Logger(CreateMangaUseCase.name)

  constructor(
    @Inject(MANGA_REPOSITORY)
    private readonly mangaRepository: MangaRepository,
    @Inject(CHAPTER_REPOSITORY)
    private readonly chapterRepository: ChapterRepository,
    @Inject()
    private readonly findUploadByUrlUseCase: FindUploadByUrlUseCase,
    @Inject()
    private readonly updateStatusUploadUseCase: UpdateUploadStatusUseCase,
    @Inject()
    private readonly getAuthorByIdUseCase: GetAuthorByIdUseCase,
    @Inject()
    private readonly getGenreByIdUseCase: GetGenreByIdUseCase,
    @Inject()
    private readonly getDemographicByIdUseCase: GetDemographicByIdUseCase,
    private readonly mangaFactory: MangaFactory,
  ) {}

  async execute(params: CreateMangaDto) {
    const { authors, genres, demographic } = params

    const genresIds = genres.map((genre) => genre.id)
    const authorsIds = authors.map((author) => author.id)

    const slugName = slugify(params.originalName, {
      lower: true,
      strict: true,
      locale: 'es',
      trim: true,
    })

    const exists = await this.mangaRepository.existBySlugName(slugName)

    if (exists) {
      this.logger.warn(
        `Creation failed: Manga already exists with name: ${params.originalName}`,
      )
      throw new MangaAlreadyExistsException(params.originalName)
    }

    const authorsEntities = await Promise.all(
      authorsIds.map((id) => this.getAuthorByIdUseCase.execute(id)),
    )

    const genresEntities = await Promise.all(
      genresIds.map((id) => this.getGenreByIdUseCase.execute(id)),
    )
    const demographicEntity = await this.getDemographicByIdUseCase.execute(
      demographic.id,
    )

    const coverUpload = await this.findUploadByUrlUseCase.execute({
      url: params.coverImage,
    })
    const bannerUpload = await this.findUploadByUrlUseCase.execute({
      url: params.bannerImage,
    })

    const newManga = this.mangaFactory.create({
      originalName: params.originalName,
      slugName: slugName,
      alternativeNames: params.alternativeNames || null,
      sinopsis: params.sinopsis,
      chapters: params.chapters,
      releaseDate: new Date(params.releaseDate),
      publicationStatus: params.publicationStatus,
      coverImage: params.coverImage,
      bannerImage: params.bannerImage,
      authors: authorsEntities,
      genres: genresEntities,
      demographic: demographicEntity,
    })

    const savedManga = await this.mangaRepository.save(newManga)

    await Promise.all([
      this.updateStatusUploadUseCase.execute({
        id: coverUpload.id,
        status: UploadStatus.ACTIVE,
      }),
      this.updateStatusUploadUseCase.execute({
        id: bannerUpload.id,
        status: UploadStatus.ACTIVE,
      }),
    ])

    await this.chapterRepository.saveMany(savedManga.id, savedManga.chapters)

    this.logger.log(
      `Manga created successfully with name ${savedManga.originalName} and ID ${savedManga.id}`,
    )

    return savedManga
  }
}
