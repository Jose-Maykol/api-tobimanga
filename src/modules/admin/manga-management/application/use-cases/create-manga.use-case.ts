import slugify from 'slugify'

import { Inject, Injectable } from '@nestjs/common'

import { MangaAlreadyExistsException } from '@/core/domain/exceptions/manga/manga-already-exists'
import { MangaFactory } from '@/core/domain/factories/manga/manga.factory'
import { ChapterRepository } from '@/core/domain/repositories/chapter.repository'
import { MangaRepository } from '@/core/domain/repositories/manga.repository'
import { IMAGE_STORAGE_SERVICE } from '@/core/storage/constants/storage.constants'
import { ImageStorageService } from '@/core/storage/services/image-storage.service'
import {
  CHAPTER_REPOSITORY,
  MANGA_REPOSITORY,
} from '@/infrastructure/tokens/repositories'
import { GetDemographicByIdUseCase } from '@/modules/admin/demographic-management/application/use-cases/get-demographic-by-id.use-case'
import { GetGenreByIdUseCase } from '@/modules/admin/genre-management/application/use-cases/get-genre-by-id.use-case'
import { CreateMangaDto } from '@/modules/admin/manga-management/application/dtos/create-manga.dto'
import { GetAuthorsByIdsUseCase } from '@/modules/author/application/use-cases/get-authors-by-ids.use-case'

@Injectable()
export class CreateMangaUseCase {
  constructor(
    @Inject(MANGA_REPOSITORY)
    private readonly mangaRepository: MangaRepository,
    @Inject(CHAPTER_REPOSITORY)
    private readonly chapterRepository: ChapterRepository,
    @Inject()
    private readonly getAuthorsByIdsUseCase: GetAuthorsByIdsUseCase,
    @Inject()
    private readonly getGenreByIdUseCase: GetGenreByIdUseCase,
    @Inject()
    private readonly getDemographicByIdUseCase: GetDemographicByIdUseCase,
    @Inject(IMAGE_STORAGE_SERVICE)
    private readonly imageStorageService: ImageStorageService,
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
      throw new MangaAlreadyExistsException()
    }

    const authorsEntities =
      await this.getAuthorsByIdsUseCase.execute(authorsIds)

    const genresEntities = await Promise.all(
      genresIds.map((id) => this.getGenreByIdUseCase.execute(id)),
    )
    const demographicEntity = await this.getDemographicByIdUseCase.execute(
      demographic.id,
    )

    const [coverImage, bannerImage] = await Promise.all([
      await this.imageStorageService.uploadFromBase64(params.coverImage.data),
      await this.imageStorageService.uploadFromBase64(params.bannerImage.data),
    ])

    const newManga = this.mangaFactory.create({
      originalName: params.originalName,
      slugName: slugName,
      alternativeNames: params.alternativeNames || null,
      sinopsis: params.sinopsis,
      chapters: params.chapters,
      releaseDate: new Date(params.releaseDate),
      publicationStatus: params.publicationStatus,
      coverImage: coverImage.url,
      bannerImage: bannerImage.url,
      authors: authorsEntities,
      genres: genresEntities,
      demographic: demographicEntity,
    })

    const savedManga = await this.mangaRepository.save(newManga)
    await this.chapterRepository.saveMany(savedManga.id, savedManga.chapters)

    return savedManga
  }
}
