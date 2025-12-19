import slugify from 'slugify'

import { Inject, Injectable } from '@nestjs/common'

import { Manga } from '@/core/domain/entities/manga.entity'
import { UploadStatus } from '@/core/domain/entities/upload.entity'
import { MangaAlreadyExistsException } from '@/core/domain/exceptions/manga/manga-already-exists'
import { MangaNotFoundException } from '@/core/domain/exceptions/manga/manga-not-found'
import { MangaRepository } from '@/core/domain/repositories/manga.repository'
import { MANGA_REPOSITORY } from '@/infrastructure/tokens/repositories'
import { GetAuthorByIdUseCase } from '@/modules/admin/author-management/application/use-cases/get-author-by-id.use-case'
import { GetDemographicByIdUseCase } from '@/modules/admin/demographic-management/application/use-cases/get-demographic-by-id.use-case'
import { GetGenreByIdUseCase } from '@/modules/admin/genre-management/application/use-cases/get-genre-by-id.use-case'
import { FindUploadByUrlUseCase } from '@/modules/admin/upload/application/use-cases/find-upload-by-url.use-case'
import { UpdateUploadStatusUseCase } from '@/modules/admin/upload/application/use-cases/update-upload-status.use-case'

import { UpdateMangaDto } from '../dtos/update-manga.dto'

@Injectable()
export class UpdateMangaUseCase {
  constructor(
    @Inject(MANGA_REPOSITORY)
    private readonly mangaRepository: MangaRepository,
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
  ) {}

  async execute(id: string, params: UpdateMangaDto) {
    const manga = await this.mangaRepository.findById(id)
    if (!manga) {
      throw new MangaNotFoundException()
    }

    const slugName: string =
      params.originalName !== manga.originalName
        ? slugify(params.originalName, {
            lower: true,
            strict: true,
            locale: 'es',
            trim: true,
          })
        : manga.slugName

    if (params.originalName !== manga.originalName) {
      const exists: boolean =
        await this.mangaRepository.existBySlugName(slugName)
      if (exists && slugName !== manga.slugName) {
        throw new MangaAlreadyExistsException()
      }
    }

    const authorsIds: string[] = params.authors.map((author) => author.id)
    const authorsEntities = await Promise.all(
      authorsIds.map((id) => this.getAuthorByIdUseCase.execute(id)),
    )

    const genresIds: string[] = params.genres.map((genre) => genre.id)
    const genresEntities = await Promise.all(
      genresIds.map((id) => this.getGenreByIdUseCase.execute(id)),
    )

    const demographicEntity = await this.getDemographicByIdUseCase.execute(
      params.demographic.id,
    )

    const coverImage: string = params.coverImage
    const bannerImage: string = params.bannerImage

    if (coverImage) {
      const coverUpload = await this.findUploadByUrlUseCase.execute({
        url: coverImage,
      })
      await this.updateStatusUploadUseCase.execute({
        id: coverUpload.id,
        status: UploadStatus.ACTIVE,
      })
    }

    if (bannerImage) {
      const bannerUpload = await this.findUploadByUrlUseCase.execute({
        url: bannerImage,
      })
      await this.updateStatusUploadUseCase.execute({
        id: bannerUpload.id,
        status: UploadStatus.ACTIVE,
      })
    }

    //TODO: Borrar imagenes antiguas si es que cambiaron

    const updatedManga: Manga = {
      id: manga.id,
      originalName: params.originalName,
      slugName,
      //TODO: Agregar scrappingName en dto
      scrappingName: manga.scrappingName,
      alternativeNames: params.alternativeNames || [],
      sinopsis: params.sinopsis,
      chapters: manga.chapters,
      releaseDate: new Date(params.releaseDate),
      coverImage,
      bannerImage,
      publicationStatus: params.publicationStatus,
      rating: manga.rating,
      active: manga.active,
      authors: authorsEntities,
      genres: genresEntities,
      demographic: demographicEntity,
      createdAt: manga.createdAt,
      updatedAt: new Date(),
    }

    const savedManga = await this.mangaRepository.update(updatedManga)

    return savedManga
  }
}
