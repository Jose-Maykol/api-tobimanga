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

export enum UserMangaStatus {
  READING = 'READING',
  COMPLETED = 'COMPLETED',
  DROPPED = 'DROPPED',
  PLANNING_TO_READ = 'PLANNING_TO_READ',
  PAUSED = 'PAUSED',
  UNKNOWN = 'UNKNOWN',
}

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

  @Column({ nullable: true, default: 0 })
  rating: number

  @Column({ type: 'enum', enum: UserMangaStatus, nullable: false })
  status: UserMangaStatus

  @CreateDateColumn({
    type: 'timestamptz',
    name: 'created_at',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date
}
