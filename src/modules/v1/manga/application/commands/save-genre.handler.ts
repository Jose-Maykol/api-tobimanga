import { ICommand } from '@nestjs/cqrs'
import { SaveGenreDto } from '../../interface/dto/save-genre.dto'

export class SaveGenreCommand implements ICommand {
  constructor(public readonly genre: SaveGenreDto) {}
}
