import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity('mangas')
export class Manga {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true })
  title: string

  @Column()
  description: string

  @Column()
  chapters: number

  @Column({ nullable: true })
  release_year: number

  @Column({ nullable: true })
  image_url: string

  @Column({ default: false })
  finalized: boolean

  @Column({ default: 0 })
  rating: number

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date
}
