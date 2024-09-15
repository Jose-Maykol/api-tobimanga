import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm'
import { Demography } from './demography.entity'

export enum PublicationStatus {
  ONGOING = 'ONGOING',
  FINISHED = 'FINISHED',
  HIATUS = 'HIATUS',
  CANCELLED = 'CANCELLED',
  NOT_YET_RELEASED = 'NOT_YET_RELEASED',
  UNKNOWN = 'UNKNOWN',
}

@Entity('mangas')
export class Manga {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => Demography, (demography) => demography.id, {
    onDelete: 'CASCADE',
  })
  @Column({ name: 'demographic_id', nullable: false })
  demograhic: string

  @Column({ unique: true, name: 'original_name', nullable: false })
  originalName: string

  @Column({ name: 'alternative_names', type: 'simple-array' })
  alternativeNames: string[]

  @Column({ nullable: false })
  sinopsis: string

  @Column({ nullable: false })
  chapters: number

  @Column({ name: 'release_date' })
  releaseDate: Date

  @Column({ name: 'cover_image' })
  coverImage: string

  @Column({ name: 'banner_image' })
  bannerImage: string

  @Column({
    type: 'enum',
    enum: PublicationStatus,
    name: 'publication_status',
    nullable: false,
  })
  publicationStatus: PublicationStatus

  @Column({ default: 0 })
  rating: number

  @Column({ default: false })
  active: boolean

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
