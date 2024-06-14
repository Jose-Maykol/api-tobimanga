import { Manga } from '../models/manga.entity'
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateMangaDto } from './dto/create-manga.dto'
import { UpdateMangaDto } from './dto/update-manga.dto'

@Injectable()
export class MangasService {
  constructor(
    @InjectRepository(Manga)
    private readonly mangasRepository: Repository<Manga>,
  ) {}

  async create(createMangaDto: CreateMangaDto): Promise<Manga> {
    const manga = this.mangasRepository.create(createMangaDto)
    return this.mangasRepository.save(manga, {
      data: {
        id: true,
        title: true,
      },
    })
  }

  async exists(title: string): Promise<boolean> {
    const manga = await this.mangasRepository.exists({
      where: { title },
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

  async update(id: string, updateMangaDto: UpdateMangaDto): Promise<Manga> {
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
  }
}
