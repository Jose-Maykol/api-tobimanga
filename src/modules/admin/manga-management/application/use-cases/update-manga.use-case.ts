import slugify from 'slugify'

import { Inject, Injectable, Logger } from '@nestjs/common'

import { IMAGE_STORAGE_SERVICE } from '@/core/storage/constants/storage.constants'
import { StorageService } from '@/core/storage/interfaces/storage.service'
import { GetAuthorByIdUseCase } from '@/modules/admin/author-management/application/use-cases/get-author-by-id.use-case'
import { GetDemographicByIdUseCase } from '@/modules/admin/demographic-management/application/use-cases/get-demographic-by-id.use-case'
import { GetGenreByIdUseCase } from '@/modules/admin/genre-management/application/use-cases/get-genre-by-id.use-case'
import { MangaAlreadyExistsException } from '@/modules/admin/manga-management/domain/exceptions/manga-already-exists.exception'
import { MangaNotFoundException } from '@/modules/admin/manga-management/domain/exceptions/manga-not-found.exception'
import { FindUploadByUrlUseCase } from '@/modules/admin/upload/application/use-cases/find-upload-by-url.use-case'
import { UpdateUploadStatusUseCase } from '@/modules/admin/upload/application/use-cases/update-upload-status.use-case'
import { UploadStatus } from '@/modules/admin/upload/domain/entities/upload.entity'

import { Manga } from '../../domain/entities/manga.entity'
import { MangaRepository } from '../../domain/repositories/manga.repository'
import { MANGA_REPOSITORY } from '../../domain/tokens'
import { UpdateMangaDto } from '../dtos/update-manga.dto'

@Injectable()
export class UpdateMangaUseCase {
  private readonly logger = new Logger(UpdateMangaUseCase.name)

  constructor(
    @Inject(MANGA_REPOSITORY)
    private readonly mangaRepository: MangaRepository,
    @Inject(IMAGE_STORAGE_SERVICE)
    private readonly storageService: StorageService,
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
      this.logger.warn(`Update failed manga not found with ID: ${id}`)
      throw new MangaNotFoundException(id)
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
        this.logger.warn(
          `Update failed manga name already exists: ${params.originalName}`,
        )
        throw new MangaAlreadyExistsException(params.originalName)
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

    if (coverImage && coverImage !== manga.coverImage) {
      const coverUpload = await this.findUploadByUrlUseCase.execute({
        url: coverImage,
      })
      await this.updateStatusUploadUseCase.execute({
        id: coverUpload.id,
        status: UploadStatus.ACTIVE,
      })

      if (manga.coverImage) {
        try {
          const oldCoverUpload = await this.findUploadByUrlUseCase.execute({
            url: manga.coverImage,
          })
          await this.storageService.delete(oldCoverUpload.objectKey)
          await this.updateStatusUploadUseCase.execute({
            id: oldCoverUpload.id,
            status: UploadStatus.DELETED,
          })
        } catch (error) {
          this.logger.error(
            `Failed to delete old cover image: ${(error as Error).message}`,
          )
        }
      }
    }

    if (bannerImage && bannerImage !== manga.bannerImage) {
      const bannerUpload = await this.findUploadByUrlUseCase.execute({
        url: bannerImage,
      })
      await this.updateStatusUploadUseCase.execute({
        id: bannerUpload.id,
        status: UploadStatus.ACTIVE,
      })

      if (manga.bannerImage) {
        try {
          const oldBannerUpload = await this.findUploadByUrlUseCase.execute({
            url: manga.bannerImage,
          })
          await this.storageService.delete(oldBannerUpload.objectKey)
          await this.updateStatusUploadUseCase.execute({
            id: oldBannerUpload.id,
            status: UploadStatus.DELETED,
          })
        } catch (error) {
          this.logger.error(
            `Failed to delete old banner image: ${(error as Error).message}`,
          )
        }
      }
    }

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

    this.logger.log(
      `Manga updated successfully with name ${savedManga.originalName} and ID ${id}`,
    )

    return savedManga
  }
}
