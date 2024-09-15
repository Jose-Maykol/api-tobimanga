import { Entity, ManyToOne, PrimaryColumn, JoinColumn } from 'typeorm'
import { Manga } from './manga.entity'
import { Genre } from './genre.entity'

@Entity('manga_genres')
export class MangaGenre {
  @PrimaryColumn({ name: 'manga_id' })
  mangaId: string

  @PrimaryColumn({ name: 'genre_id' })
  genreId: string

  @ManyToOne(() => Manga, (manga) => manga.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'manga_id' })
  manga: Manga

  @ManyToOne(() => Genre, (genre) => genre.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'genre_id' })
  genre: Genre
}
