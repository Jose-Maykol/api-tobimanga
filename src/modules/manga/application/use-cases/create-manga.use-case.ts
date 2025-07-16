import { Inject, Injectable } from '@nestjs/common'
import { CreateMangaDto } from '../dtos/create-manga.dto'
import { GetAuthorsByIdsUseCase } from '@/modules/author/application/use-cases/get-authors-by-ids.use-case'
import { GetGenresByIdsUseCase } from '@/modules/genres/application/use-cases/get-genres-by-ids.use-case'
import { GetDemographicByIdUseCase } from '@/modules/demographic/application/use-cases/get-demographic-by-id.use-case'
import { IMAGE_STORAGE_SERVICE } from '@/core/storage/constants/storage.constants'
import { ImageStorageService } from '@/core/storage/services/image-storage.service'
import { MangaFactory } from '../../domain/factories/manga.factory'
import { MangaRepository } from '../../domain/repositories/manga.repository'

@Injectable()
export class CreateMangaUseCase {
  constructor(
    @Inject('MangaRepository')
    private readonly mangaRepository: MangaRepository,
    @Inject()
    private readonly getAuthorsByIdsUseCase: GetAuthorsByIdsUseCase,
    @Inject()
    private readonly getGenresByIdsUseCase: GetGenresByIdsUseCase,
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

    // TODO: Validar si ya existe el manga con el mismo título

    const authorsEntities =
      await this.getAuthorsByIdsUseCase.execute(authorsIds)
    const genresEntities = await this.getGenresByIdsUseCase.execute(genresIds)
    const demographicEntity = await this.getDemographicByIdUseCase.execute(
      demographic.id,
    )

    const [coverImage, bannerImage] = await Promise.all([
      await this.imageStorageService.uploadFromBase64(params.coverImage.data),
      await this.imageStorageService.uploadFromBase64(params.bannerImage.data),
    ])

    const newManga = this.mangaFactory.create({
      originalName: params.originalName,
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

    await this.mangaRepository.save(newManga)

    return newManga
  }
}
