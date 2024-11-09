import { ICommand } from '@nestjs/cqrs'
import { SaveMangaDto } from '../../interface/dto/save-manga.dto'
import { SaveMangaDemographicDto } from '../../interface/dto/save-manga-demographic.dto'
import { SaveMangaGenresDto } from '../../interface/dto/save-manga-genres.dto'
import { SaveMangaAuthorsDto } from '../../interface/dto/save-manga-authors.dto'

export class SaveMangaCommand implements ICommand {
  constructor(
    public readonly manga: SaveMangaDto,
    public readonly authors: SaveMangaAuthorsDto,
    public readonly genres: SaveMangaGenresDto,
    public readonly demographic: SaveMangaDemographicDto,
  ) {}
}
