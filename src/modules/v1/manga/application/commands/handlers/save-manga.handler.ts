import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { SaveMangaCommand } from '../save-manga.command'
import { Inject } from '@nestjs/common'
import { MangaRepository } from '../../../domain/repositories/manga.repository'
import { CloudinaryService } from '@/cloudinary/cloudinary.service'
import { MangaFactory } from '../../../domain/factories/manga.factory'
import { AuthorRepository } from '../../../domain/repositories/author.repository'
import { GenreRepository } from '../../../domain/repositories/genre.repository'
import { DemographicRepository } from '../../../domain/repositories/demographic.repository'
import { MangaAlreadyExistsException } from '../../exceptions/manga-already-exists.exception'
import { DemographicNotFoundException } from '../../exceptions/demographic-not-found.exception'
import { AuthorNotFoundException } from '../../exceptions/author-not-found.exception'
import { GenreNotFoundException } from '../../exceptions/genre-not-found.exceptions'

@CommandHandler(SaveMangaCommand)
export class SaveMangaHandler implements ICommandHandler<SaveMangaCommand> {
  constructor(
    @Inject('MangaRepository')
    private readonly mangaRepository: MangaRepository,
    @Inject('AuthorRepository')
    private readonly authorRepository: AuthorRepository,
    @Inject('GenreRepository')
    private readonly genreRepository: GenreRepository,
    @Inject('DemographicRepository')
    private readonly demographicRepository: DemographicRepository,
    private readonly cloudinaryService: CloudinaryService,
    private readonly mangaFactory: MangaFactory,
  ) {}

  async execute(command: SaveMangaCommand) {
    const { manga, authors, genres, demographic } = command

    const genreIds = genres.map((genre) => genre.id)
    const authorIds = authors.map((author) => author.id)

    const [mangaExists, demographicData, authorsData, genresData] =
      await Promise.all([
        this.mangaRepository.existsByTitle(manga.originalName),
        this.demographicRepository.findById(demographic.id),
        this.authorRepository.findByIds(authorIds),
        this.genreRepository.findByIds(genreIds),
      ])

    if (mangaExists) throw new MangaAlreadyExistsException()
    if (!demographicData) throw new DemographicNotFoundException()
    if (authorsData?.length !== authors.length)
      throw new AuthorNotFoundException()
    if (genresData?.length !== genres.length) throw new GenreNotFoundException()

    const [uploadedCoverImage, uploadedBannerImage] = await Promise.all([
      this.cloudinaryService.uploadFileFromJson(manga.coverImage),
      this.cloudinaryService.uploadFileFromJson(manga.bannerImage),
    ])

    const newManga = this.mangaFactory.create({
      originalName: manga.originalName,
      alternativeNames: manga.alternativeNames,
      sinopsis: manga.sinopsis,
      chapters: manga.chapters,
      releaseDate: new Date(manga.releaseDate),
      publicationStatus: manga.publicationStatus,
      coverImage: uploadedCoverImage.secure_url,
      bannerImage: uploadedBannerImage.secure_url,
      authors: [],
      genres: [],
      demographic: demographicData,
    })

    newManga.setAuthors(authorsData)
    newManga.setGenres(genresData)

    await this.mangaRepository.save(newManga)

    return {
      message: 'Manga creado exitosamente',
      manga: {
        id: newManga.getId(),
      },
    }
  }
}
