import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { Manga } from './manga.entity'

@Entity('chapters')
export class Chapter {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => Manga, (manga) => manga.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'manga_id' })
  manga: string

  @Column()
  chapter_number: number

  @Column({ nullable: true })
  release_date: Date

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date
}
