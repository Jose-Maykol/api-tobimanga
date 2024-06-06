import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { Manga } from './manga.entity'
import { Genre } from './genre.entity'

@Entity('manga_genres')
export class MangaGenre {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => Manga, (manga) => manga.id, { onDelete: 'CASCADE' })
  @Column()
  manga_id: string

  @ManyToOne(() => Genre, (genre) => genre.id, { onDelete: 'CASCADE' })
  @Column()
  genre_id: string
}
