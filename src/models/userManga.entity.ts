import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { User } from './user.entity'
import { Manga } from './manga.entity'

@Entity('user_mangas')
export class UserManga {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User

  @ManyToOne(() => Manga, (manga) => manga.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'manga_id' })
  manga: Manga

  @Column({ nullable: true })
  rating: number

  @Column({ default: false })
  favorite: boolean

  @Column({ default: false })
  dropped: boolean

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date
}
