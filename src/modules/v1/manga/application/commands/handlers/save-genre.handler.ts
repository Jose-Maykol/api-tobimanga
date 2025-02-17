import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { SaveGenreCommand } from '../save-genre.command'
import { ConflictException, Inject } from '@nestjs/common'
import { GenreRepository } from '../../../domain/repositories/genre.repository'
import { GenreFactory } from '../../../domain/factories/genre.factory'

@CommandHandler(SaveGenreCommand)
export class SaveGenreHandler implements ICommandHandler<SaveGenreCommand> {
  constructor(
    @Inject('GenreRepository')
    private readonly genreRepository: GenreRepository,
    private readonly genreFactory: GenreFactory,
  ) {}

  async execute(command: SaveGenreCommand) {
    const { genre } = command

    const genreExists = await this.genreRepository.findByName(genre.name)

    if (genreExists) {
      throw new ConflictException('Este genero ya existe')
    }

    const genreEntity = this.genreFactory.create(genre)
    const savedGenre = await this.genreRepository.save(genreEntity)

    return {
      message: 'Genero creado con exito',
      genre: {
        id: savedGenre.getId(),
      },
    }
  }
}
