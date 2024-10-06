import { Author } from '@/models/author.entity'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CreateAuthorDto } from './dto/create-author.dto'
import { Repository } from 'typeorm'

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(Author)
    private authorsRepository: Repository<Author>,
  ) {}

  public async createAuthor(author: CreateAuthorDto): Promise<{
    id: string
    name: string
  }> {
    const alreadyExists = await this.exists(author.name)

    if (alreadyExists) {
      throw new Error('Este autor ya existe')
    }

    const authorEntity = this.authorsRepository.create(author)
    const savedAuthor = await this.authorsRepository.save(authorEntity, {
      data: {
        id: true,
        name: true,
      },
    })

    return {
      id: savedAuthor.id,
      name: savedAuthor.name,
    }
  }

  public async getAuthors(): Promise<{ id: string; name: string }[]> {
    return await this.authorsRepository.find({ select: ['id', 'name'] })
  }

  private async exists(name: string): Promise<boolean> {
    const author = await this.authorsRepository.findOne({
      where: {
        name,
      },
    })
    return !!author
  }
}
