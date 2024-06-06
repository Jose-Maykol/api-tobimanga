// src/mangas/dto/update-manga.dto.ts
import { PartialType } from '@nestjs/mapped-types'
import { CreateMangaDto } from './create-manga.dto'

export class UpdateMangaDto extends PartialType(CreateMangaDto) {}
