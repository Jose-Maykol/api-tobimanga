import { Manga } from '../models/manga.entity'
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, QueryRunner, Repository } from 'typeorm'
import { CreateMangaDto } from './dto/create-manga.dto'
/* import { UpdateMangaDto } from './dto/update-manga.dto' */
import { CloudinaryService } from '@/cloudinary/cloudinary.service'
import { ChaptersService } from '@/chapters/chapters.service'
import { MangaGenre } from '@/models/mangaGenre.entity'
import { MangaAuthor } from '@/models/mangaAuthor.entity'
import { Chapter } from '@/models/chapter.entity'

@Injectable()
export class MangasService {
  constructor(
    @InjectRepository(Manga)
    private readonly mangasRepository: Repository<Manga>,
    @InjectRepository(MangaAuthor)
    private readonly mangaAuthorRepository: Repository<MangaAuthor>,
    @InjectRepository(MangaGenre)
    private readonly mangaGenreRepository: Repository<MangaGenre>,
    private readonly chaptersService: ChaptersService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly dataSource: DataSource,
  ) {}

  public async createManga(manga: CreateMangaDto): Promise<{
    id: string
    name: string
  }> {
    const alreadyExists = await this.exists(manga.originalName)

    if (alreadyExists) {
      throw new Error('Este manga ya existe')
    }

    const { coverImage, bannerImage } = await this.uploadImages(manga)

    const { authors, genres, ...mangaData } = manga

    const newManga = {
      ...mangaData,
      coverImage: coverImage,
      bannerImage: bannerImage,
      demographic: { id: manga.demographic },
    }

    const queryRunner = this.dataSource.createQueryRunner()

    await queryRunner.startTransaction()

    try {
      const mangaEntity = await queryRunner.manager
        .getRepository(Manga)
        .create(newManga)
      const savedManga = await queryRunner.manager
        .getRepository(Manga)
        .save(mangaEntity, {
          data: {
            id: true,
            originalName: true,
          },
        })

      await this.chaptersService.createChapters(
        savedManga.id,
        manga.chapters,
        queryRunner,
      )

      await this.createMangaAuthors(savedManga.id, authors, queryRunner)
      await this.createMangaGenres(savedManga.id, genres, queryRunner)

      await queryRunner.commitTransaction()

      return {
        id: savedManga.id,
        name: savedManga.originalName,
      }
    } catch (error) {
      await queryRunner.rollbackTransaction()
      console.log('error', error)
      throw new Error('Error creando el manga')
    } finally {
      await queryRunner.release()
    }
  }

  async createMangaAuthors(
    id: string,
    authors: string[],
    queryRunner: QueryRunner,
  ): Promise<void> {
    const mangaAuthors = authors.map((author) => ({
      mangaId: id,
      authorId: author,
    }))
    await queryRunner.manager.getRepository(MangaAuthor).save(mangaAuthors)
  }

  async createMangaGenres(
    id: string,
    genres: string[],
    queryRunner: QueryRunner,
  ): Promise<void> {
    const mangaGenres = genres.map((genre) => ({
      mangaId: id,
      genreId: genre,
    }))
    await queryRunner.manager.getRepository(MangaGenre).save(mangaGenres)
  }

  private async exists(title: string): Promise<boolean> {
    const manga = await this.mangasRepository.exists({
      where: { originalName: title },
    })
    return manga
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ results: Manga[]; total: number }> {
    const [mangas, total] = await this.mangasRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
      select: {
        id: true,
        originalName: true,
        chapters: true,
        coverImage: true,
        rating: true,
      },
    })
    return { results: mangas, total }
  }

  async findOne(
    id: string,
  ): Promise<Manga & { authors: string[]; genres: string[] }> {
    const manga = await this.mangasRepository.findOne({
      where: { id },
      select: {
        id: true,
        originalName: true,
        alternativeNames: true,
        sinopsis: true,
        chapters: true,
        releaseDate: true,
        coverImage: true,
        bannerImage: true,
        publicationStatus: true,
        rating: true,
      },
    })
    if (!manga) {
      throw new NotFoundException(`Manga #${id} not found`)
    }
    const mangaAuthors = await this.getMangaAuthors(id)
    const mangaGenres = await this.getMangaGenres(id)
    return { ...manga, authors: mangaAuthors, genres: mangaGenres }
  }

  async getMangaAuthors(id: string): Promise<string[]> {
    const mangaAuthors = await this.mangaAuthorRepository
      .createQueryBuilder('mangaAuthor')
      .innerJoinAndSelect('mangaAuthor.author', 'author')
      .where('mangaAuthor.mangaId = :id', { id })
      .select(['mangaAuthor.authorId', 'author.name'])
      .getMany()
    return mangaAuthors.map((author) => author.author.name)
  }

  async getMangaGenres(id: string): Promise<string[]> {
    const mangaGenres = await this.mangaGenreRepository
      .createQueryBuilder('mangaGenre')
      .innerJoinAndSelect('mangaGenre.genre', 'genre')
      .where('mangaGenre.mangaId = :id', { id })
      .select(['mangaGenre.genreId', 'genre.name'])
      .getMany()
    return mangaGenres.map((genre) => genre.genre.name)
  }

  async uploadImages(
    manga: CreateMangaDto,
  ): Promise<{ coverImage: string; bannerImage: string }> {
    try {
      const [uploadedCoverImage, uploadedBannerImage] = await Promise.all([
        this.cloudinaryService.uploadFileFromJson(manga.coverImage),
        this.cloudinaryService.uploadFileFromJson(manga.bannerImage),
      ])

      return {
        coverImage: uploadedCoverImage.secure_url,
        bannerImage: uploadedBannerImage.secure_url,
      }
    } catch (error) {
      throw new Error('Error subiendo las imágenes')
    }
  }

  async findOneBySlug(
    slug: string,
  ): Promise<Manga & { authors: string[]; genres: string[] }> {
    const title = slug.replace(/-/g, ' ')
    const manga = await this.mangasRepository
      .createQueryBuilder('manga')
      .innerJoinAndSelect('manga.demographic', 'demographic')
      .where('LOWER(manga.originalName) = LOWER(:title)', { title })
      .select([
        'manga.id',
        'manga.originalName',
        'manga.alternativeNames',
        'manga.sinopsis',
        'manga.chapters',
        'manga.releaseDate',
        'manga.coverImage',
        'manga.bannerImage',
        'manga.publicationStatus',
        'manga.rating',
        'demographic.name',
      ])
      .getOne()
    if (!manga) {
      throw new NotFoundException(`Manga ${title} no encontrado`)
    }
    const mangaAuthors = await this.getMangaAuthors(manga.id)
    const mangaGenres = await this.getMangaGenres(manga.id)
    return { ...manga, authors: mangaAuthors, genres: mangaGenres }
  }

  async findUserMangaChapters(
    userId: string,
    mangaId: string,
  ): Promise<{ chapterId: string; chapterNumber: number; isRead: boolean }[]> {
    const userMangaChapters = await this.mangasRepository
      .createQueryBuilder('chapter')
      .from(Chapter, 'chapters')
      .leftJoinAndSelect(
        'user_chapters',
        'uc',
        'uc.chapter_id = chapters.id AND uc.user_id = :userId',
        { userId },
      )
      .where('chapters.manga_id = :mangaId', { mangaId })
      .select([
        'chapters.id AS chapter_id', // ID del capítulo
        'chapters.chapter_number AS chapter_number', // Número del capítulo
        'COALESCE(uc.read, false) AS is_read', // Estado de lectura (falso si no hay registro)
      ])
      .orderBy('chapters.chapter_number', 'DESC')
      .getRawMany()
    console.log('userMangaChapters', userMangaChapters)
    return userMangaChapters.map((chapter) => ({
      chapterId: chapter.chapter_id,
      chapterNumber: chapter.chapter_number,
      isRead: chapter.is_read,
    }))
  }

  /*  async update(id: string, updateMangaDto: UpdateMangaDto): Promise<Manga> {
    await this.mangasRepository.update(id, updateMangaDto)
    const updatedManga = await this.mangasRepository.findOne({ where: { id } })
    if (!updatedManga) {
      throw new NotFoundException(`Manga #${id} not found`)
    }
    return updatedManga
  }

  async remove(id: string): Promise<void> {
    const manga = await this.mangasRepository.delete(id)
    if (manga.affected === 0) {
      throw new NotFoundException(`Manga #${id} not found`)
    }
  } */
}
