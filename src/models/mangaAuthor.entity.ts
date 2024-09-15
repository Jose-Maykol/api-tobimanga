import { Entity, ManyToOne, PrimaryColumn, JoinColumn } from 'typeorm'
import { Manga } from './manga.entity'
import { Author } from './author.entity'

@Entity('manga_authors')
export class MangaAuthor {
  @PrimaryColumn({ name: 'manga_id' })
  mangaId: string

  @PrimaryColumn({ name: 'author_id' })
  authorId: string

  @ManyToOne(() => Manga, (manga) => manga.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'manga_id' })
  manga: Manga

  @ManyToOne(() => Author, (author) => author.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author_id' })
  author: Author
}
