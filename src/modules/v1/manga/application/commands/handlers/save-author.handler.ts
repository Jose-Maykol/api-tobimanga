import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { SaveAuthorCommand } from '../save-author.command'
import { ConflictException, Inject } from '@nestjs/common'
import { AuthorRepository } from '../../../domain/repositories/author.repository'
import { AuthorFactory } from '../../../domain/factories/author.factory'

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

    const authorExists = await this.authorRepository.exists(name)

    if (authorExists) {
      throw new ConflictException('Este autor ya existe')
    }

    const authorEntity = this.authorFactory.create(author)
    const savedAuthor = await this.authorRepository.save(authorEntity)

    return {
      message: 'Autor creado con exito',
      author: {
        id: savedAuthor.getId(),
      },
    }
  }
}
