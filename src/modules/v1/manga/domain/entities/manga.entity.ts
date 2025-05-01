import { Author } from './author.entity'
import { Demographic } from './demographic.entity'
import { Genre } from './genre.entity'

export type MangaProps = {
  id: string
  originalName: string
  alternativeNames: string[] | null
  slugName: string
  scrappingName: string
  sinopsis: string
  chapters: number
  releaseDate: Date
  coverImage: string
  bannerImage: string
  publicationStatus: string
  rating: number
  active: boolean
  authors: Author[]
  genres: Genre[]
  demographic: Demographic
  createdAt: Date
  updatedAt: Date | null
}

export class Manga {
  private id: string
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
    this.setId(props.id)
    this.setOriginalName(props.originalName)
    this.setAlternativeNames(props.alternativeNames)
    this.setSlugName(props.slugName)
    this.setScrappingName(props.scrappingName)
    this.setSinopsis(props.sinopsis)
    this.setChapters(props.chapters)
    this.setReleaseDate(props.releaseDate)
    this.setCoverImage(props.coverImage)
    this.setBannerImage(props.bannerImage)
    this.setPublicationStatus(props.publicationStatus)
    this.setRating(props.rating)
    this.setActive(props.active)
    this.setAuthors(props.authors)
    this.setGenres(props.genres)
    this.setDemographic(props.demographic)
    this.setCreatedAt(props.createdAt)
    this.setUpdatedAt(props.updatedAt)
  }

  public getId(): string {
    return this.id
  }

  public setId(value: string): void {
    this.id = value
  }

  public getOriginalName(): string {
    return this.originalName
  }

  public setOriginalName(value: string): void {
    this.originalName = value
  }

  public getAlternativeNames(): string[] | null {
    return this.alternativeNames
  }

  public setAlternativeNames(value: string[] | null): void {
    this.alternativeNames = value
  }

  public getSlugName(): string {
    return this.slugName
  }

  public setSlugName(value: string): void {
    this.slugName = value
  }

  public getScrappingName(): string {
    return this.scrappingName
  }

  public setScrappingName(value: string): void {
    this.scrappingName = value
  }

  public getSinopsis(): string {
    return this.sinopsis
  }

  public setSinopsis(value: string): void {
    this.sinopsis = value
  }

  public getChapters(): number {
    return this.chapters
  }

  public setChapters(value: number): void {
    this.chapters = value
  }

  public getReleaseDate(): Date {
    return this.releaseDate
  }

  public setReleaseDate(value: Date): void {
    this.releaseDate = value
  }

  public getCoverImage(): string {
    return this.coverImage
  }

  public setCoverImage(value: string): void {
    this.coverImage = value
  }

  public getBannerImage(): string {
    return this.bannerImage
  }

  public setBannerImage(value: string): void {
    this.bannerImage = value
  }

  public getPublicationStatus(): string {
    return this.publicationStatus
  }

  public setPublicationStatus(value: string): void {
    this.publicationStatus = value
  }

  public getRating(): number {
    return this.rating
  }

  public setRating(value: number): void {
    this.rating = value
  }

  public getActive(): boolean {
    return this.active
  }

  public setActive(value: boolean): void {
    this.active = value
  }

  public getAuthors(): Author[] {
    return this.authors
  }

  public setAuthors(value: Author[]): void {
    this.authors = value
  }

  public getGenres(): Genre[] {
    return this.genres
  }

  public setGenres(value: Genre[]): void {
    this.genres = value
  }

  public getDemographic(): Demographic {
    return this.demographic
  }

  public setDemographic(value: Demographic): void {
    this.demographic = value
  }

  public getCreatedAt(): Date {
    return this.createdAt
  }

  public setCreatedAt(value: Date): void {
    this.createdAt = value
  }

  public getUpdatedAt(): Date | null {
    return this.updatedAt
  }

  public setUpdatedAt(value: Date | null): void {
    this.updatedAt = value
  }
}
