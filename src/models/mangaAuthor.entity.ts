import { Entity, Column, ManyToOne } from 'typeorm'
import { Manga } from './manga.entity'
import { Author } from './author.entity'

@Entity('manga_authors')
export class MangaGenre {
  @ManyToOne(() => Manga, (manga) => manga.id, { onDelete: 'CASCADE' })
  @Column({ name: 'manga_id' })
  manga: Manga

  @ManyToOne(() => Author, (author) => author.id, { onDelete: 'CASCADE' })
  @Column({ name: 'author_id' })
  author: Author
}
