import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm'
import { User } from './user.entity'
import { Chapter } from './chapter.entity'

@Entity('user_chapters')
export class UserChapter {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  @Column()
  user_id: string

  @ManyToOne(() => Chapter, (chapter) => chapter.id, { onDelete: 'CASCADE' })
  @Column()
  chapter_id: string

  @Column({ default: false })
  read: boolean

  @Column({ type: 'timestamptz', nullable: true })
  read_at: Date

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date
}
