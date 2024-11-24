import { ICommand } from '@nestjs/cqrs'
import { SaveAuthorDto } from '../../interface/dto/save-author.dto'

export class SaveAuthorCommand implements ICommand {
  constructor(public readonly author: SaveAuthorDto) {}
}
