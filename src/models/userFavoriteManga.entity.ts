import {
  Entity,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
} from 'typeorm'
import { User } from './user.entity'
import { Manga } from './manga.entity'

@Entity('user_mangas')
export class UserFavoriteManga {
  @PrimaryColumn({ name: 'user_id' })
  userId: number

  @PrimaryColumn({ name: 'manga_id' })
  mangaId: number

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User

  @ManyToOne(() => Manga, (manga) => manga.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'manga_id' })
  manga: Manga

  @UpdateDateColumn({
    type: 'timestamptz',
    name: 'favorited_at',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  favoritedAt: Date
}
