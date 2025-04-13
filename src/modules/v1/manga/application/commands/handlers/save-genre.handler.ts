import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { SaveGenreCommand } from '../save-genre.command'
import { Inject } from '@nestjs/common'
import { GenreRepository } from '../../../domain/repositories/genre.repository'
import { GenreFactory } from '../../../domain/factories/genre.factory'
import { GenreAlreadyExistsException } from '../../exceptions/genre-already-exist.exception'

@CommandHandler(SaveGenreCommand)
export class SaveGenreHandler implements ICommandHandler<SaveGenreCommand> {
  constructor(
    @Inject('GenreRepository')
    private readonly genreRepository: GenreRepository,
    private readonly genreFactory: GenreFactory,
  ) {}

  async execute(command: SaveGenreCommand) {
    const { genre } = command
    const { name } = genre

    const genreExists = await this.genreRepository.existsByName(name)

    if (genreExists) throw new GenreAlreadyExistsException()

    const genreEntity = this.genreFactory.create(genre)
    const savedGenre = await this.genreRepository.save(genreEntity)

    return {
      message: 'Genero creado con exito',
      genre: {
        id: savedGenre.id,
      },
    }
  }
}
