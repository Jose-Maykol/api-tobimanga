import MangaRecord from '../types/manga'
import { Author } from './author.entity'
import { Demographic } from './demographic.entity'
import { Genre } from './genre.entity'

type MangaProps = Omit<MangaRecord, 'authors' | 'genres' | 'demographic'>

export class Manga {
  private originalName: string
  private alternativeNames: string[] | null
  private slugName: string
  private scrappingName: string
  private sinopsis: string
  private chapters: number
  private releaseDate: Date
  private coverImage: string
  private bannerImage: string
  private publicationStatus: string
  private rating: number
  private active: boolean
  private authors: Author[] = []
  private genres: Genre[] = []
  private demographic: Demographic
  private createdAt: Date
  private updatedAt: Date | null

  constructor(props: MangaProps) {
    this.originalName = props.originalName
    this.alternativeNames = props.alternativeNames
    this.slugName = props.slugName
    this.scrappingName = props.scrappingName
    this.rating = props.rating
    this.sinopsis = props.sinopsis
    this.chapters = props.chapters
    this.releaseDate = props.releaseDate
    this.coverImage = props.coverImage
    this.bannerImage = props.bannerImage
    this.publicationStatus = props.publicationStatus
    this.createdAt = props.createdAt
    this.updatedAt = props.updatedAt
  }

  addAuthors(authors: Author[]): void {
    this.authors = authors
  }

  addGenres(genres: Genre[]): void {
    this.genres = genres
  }

  addDemographic(demographic: Demographic): void {
    this.demographic = demographic
  }

  getOriginalName(): string {
    return this.originalName
  }

  getAlternativeNames(): string[] | null {
    return this.alternativeNames
  }

  getSinopsis(): string {
    return this.sinopsis
  }

  getChapters(): number {
    return this.chapters
  }

  getReleaseDate(): Date {
    return this.releaseDate
  }

  getCoverImage(): string {
    return this.coverImage
  }

  getBannerImage(): string {
    return this.bannerImage
  }

  getPublicationStatus(): string {
    return this.publicationStatus
  }

  getRating(): number {
    return this.rating
  }

  getDemographic(): Demographic {
    return this.demographic
  }

  getActive(): boolean {
    return this.active
  }

  getAuthors(): Author[] {
    return this.authors
  }

  getGenres(): Genre[] {
    return this.genres
  }
}
