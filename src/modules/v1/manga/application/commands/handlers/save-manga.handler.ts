import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { SaveMangaCommand } from '../save-manga.command'
import { ConflictException, Inject, NotFoundException } from '@nestjs/common'
import { MangaRepository } from '../../../domain/repositories/manga.repository'
import { CloudinaryService } from '@/cloudinary/cloudinary.service'
import { MangaFactory } from '../../../domain/factories/manga.factory'
import { DrizzleService } from '@/modules/database/services/drizzle.service'
import { AuthorRepository } from '../../../domain/repositories/author.repository'
import { GenreRepository } from '../../../domain/repositories/genre.repository'
import { DemographicRepository } from '../../../domain/repositories/demographic.repository'
import { Demographic } from '../../../domain/entities/demographic.entity'
import { Author } from '../../../domain/entities/author.entity'
import { Genre } from '../../../domain/entities/genre.entity'

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
    private readonly drizzleService: DrizzleService,
    private readonly mangaFactory: MangaFactory,
  ) {}

  async execute(command: SaveMangaCommand) {
    const { manga, authors, genres, demographic } = command

    const genreIds = genres.map((genre) => genre.id)
    const authorIds = authors.map((author) => author.id)

    const [mangaExists, demographicData, authorsData, genresData] =
      await Promise.all([
        this.mangaRepository.exists(manga.originalName),
        this.demographicRepository.findById(demographic.id),
        this.authorRepository.findByIds(authorIds),
        this.genreRepository.findByIds(genreIds),
      ])

    if (mangaExists) {
      throw new ConflictException('Este manga ya existe')
    }

    if (!demographicData) {
      throw new NotFoundException('La demografia del manga no existe')
    }

    if (authorsData.length !== authors.length) {
      throw new NotFoundException('Uno o mas autores no existen')
    }

    if (genresData.length !== genres.length) {
      throw new NotFoundException('Uno o mas generos no existen')
    }

    const [uploadedCoverImage, uploadedBannerImage] = await Promise.all([
      this.cloudinaryService.uploadFileFromJson(manga.coverImage),
      this.cloudinaryService.uploadFileFromJson(manga.bannerImage),
    ])

    const newManga = this.mangaFactory.create({
      originalName: manga.originalName,
      alternativeNames: manga.alternativesNames,
      sinopsis: manga.sinopsis,
      chapters: manga.chapters,
      releaseDate: new Date(manga.releaseDate),
      publicationStatus: manga.publicationStatus,
      coverImage: uploadedCoverImage.secure_url,
      bannerImage: uploadedBannerImage.secure_url,
    })

    const authorsEntity = authorsData.map((author) => new Author(author))
    const genresEntity = genresData.map((genre) => new Genre(genre))
    const demographicEntity = new Demographic(demographicData)

    newManga.addAuthors(authorsEntity)
    newManga.addGenres(genresEntity)
    newManga.addDemographic(demographicEntity)

    const savedManga = await this.drizzleService.db.transaction(async (tx) => {
      const savedManga = await this.mangaRepository.save(newManga, tx)
      const { id: mangaId } = savedManga
      await this.mangaRepository.saveAuthors(authorIds, mangaId, tx)
      await this.mangaRepository.saveGenres(genreIds, mangaId, tx)
      await this.mangaRepository.saveChapters(manga.chapters, mangaId, tx)

      return savedManga
    })

    return {
      message: 'Manga creado exitosamente',
      manga: {
        id: savedManga.id,
      },
    }
  }
}
