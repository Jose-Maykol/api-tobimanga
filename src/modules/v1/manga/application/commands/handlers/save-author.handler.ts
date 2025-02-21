import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { SaveAuthorCommand } from '../save-author.command'
import { Inject } from '@nestjs/common'
import { AuthorRepository } from '../../../domain/repositories/author.repository'
import { AuthorFactory } from '../../../domain/factories/author.factory'
import { AuthorAlreadyExistsException } from '../../exceptions/author-already-exist.exception'

@CommandHandler(SaveAuthorCommand)
export class SaveAuthorHandler implements ICommandHandler<SaveAuthorCommand> {
  constructor(
    @Inject('AuthorRepository')
    private readonly authorRepository: AuthorRepository,
    private readonly authorFactory: AuthorFactory,
  ) {}

  async execute(command: SaveAuthorCommand) {
    const { author } = command
    const { name } = author

    const authorExists = await this.authorRepository.findByName(name)

    if (authorExists) {
      throw new AuthorAlreadyExistsException(authorExists.name)
    }

    const authorEntity = this.authorFactory.create(author)
    const savedAuthor = await this.authorRepository.save(authorEntity)

    return {
      message: 'Autor creado con exito',
      author: {
        id: savedAuthor.id,
      },
    }
  }
}
