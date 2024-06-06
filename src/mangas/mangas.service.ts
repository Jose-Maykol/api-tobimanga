import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Manga } from 'src/models/manga.entity'
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
    return this.mangasRepository.save(manga)
  }

  async findAll(): Promise<Manga[]> {
    return this.mangasRepository.find()
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
