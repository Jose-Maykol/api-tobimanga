import { Manga } from '../models/manga.entity'
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { CreateMangaDto } from './dto/create-manga.dto'
import { UpdateMangaDto } from './dto/update-manga.dto'
import { CloudinaryService } from '@/cloudinary/cloudinary.service'
import { ChaptersService } from '@/chapters/chapters.service'

@Injectable()
export class MangasService {
  constructor(
    @InjectRepository(Manga)
    private readonly mangasRepository: Repository<Manga>,
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

    console.log('coverImage', coverImage)

    const { authors, genres, ...mangaData } = manga

    const newManga = {
      ...mangaData,
      coverImage: coverImage,
      bannerImage: bannerImage,
      demographic: { id: manga.demographic },
    }

    console.log('newManga', newManga)

    const queryRunner = this.dataSource.createQueryRunner()

    await queryRunner.startTransaction()

    try {
      const mangaEntity = this.mangasRepository.create(newManga)
      const savedManga = await this.mangasRepository.save(mangaEntity, {
        data: {
          id: true,
          originalName: true,
        },
      })

      // await this.authorsService.createAuthors(savedManga.id, manga.authors)
      // await this.genresService.createGenres(savedManga.id, manga.genres)

      await this.chaptersService.createChapters(
        savedManga.id,
        manga.chapters,
        queryRunner,
      )
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
        bannerImage: true,
        rating: true,
      },
    })
    return { results: mangas, total }
  }

  async findOne(id: string): Promise<Manga> {
    const manga = await this.mangasRepository.findOne({ where: { id } })
    if (!manga) {
      throw new NotFoundException(`Manga #${id} not found`)
    }
    return manga
  }

  async uploadImages(
    manga: CreateMangaDto,
  ): Promise<{ coverImage: string; bannerImage: string }> {
    try {
      const [uploadedCoverImage, uploadedBannerImage] = await Promise.all([
        this.cloudinaryService.uploadFileFromJson(manga.coverImage),
        this.cloudinaryService.uploadFileFromJson(manga.bannerImage),
      ])

      console.log('uploadedBannerImage', uploadedBannerImage)
      console.log('uploadedCoverImage', uploadedCoverImage)

      return {
        coverImage: uploadedCoverImage.secure_url,
        bannerImage: uploadedBannerImage.secure_url,
      }
    } catch (error) {
      throw new Error('Error subiendo las imágenes')
    }
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
