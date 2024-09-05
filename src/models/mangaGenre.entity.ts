import { Entity, Column, ManyToOne } from 'typeorm'
import { Manga } from './manga.entity'
import { Genre } from './genre.entity'

@Entity('manga_genres')
export class MangaGenre {
  @ManyToOne(() => Manga, (manga) => manga.id, { onDelete: 'CASCADE' })
  @Column({ name: 'manga_id' })
  manga: Manga

  @ManyToOne(() => Genre, (genre) => genre.id, { onDelete: 'CASCADE' })
  @Column({ name: 'genre_id' })
  genre: Genre
}
