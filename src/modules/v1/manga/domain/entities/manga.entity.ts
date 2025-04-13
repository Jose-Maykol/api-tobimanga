import { Author } from './author.entity'
import { Demographic } from './demographic.entity'
import { Genre } from './genre.entity'

export type MangaProps = {
  id: string
  originalName: string
  alternativeNames?: string[]
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
  updatedAt?: Date
}

export class Manga {
  private _id: string
  private _originalName: string
  private _alternativeNames?: string[]
  private _slugName: string
  private _scrappingName: string
  private _sinopsis: string
  private _chapters: number
  private _releaseDate: Date
  private _coverImage: string
  private _bannerImage: string
  private _publicationStatus: string
  private _rating: number
  private _active: boolean
  private _authors: Author[] = []
  private _genres: Genre[] = []
  private _demographic: Demographic
  private _createdAt: Date
  private _updatedAt?: Date

  constructor(props: MangaProps) {
    this._id = props.id
    this._originalName = props.originalName
    this._alternativeNames = props.alternativeNames
    this._slugName = props.slugName
    this._scrappingName = props.scrappingName
    this._sinopsis = props.sinopsis
    this._chapters = props.chapters
    this._releaseDate = props.releaseDate
    this._coverImage = props.coverImage
    this._bannerImage = props.bannerImage
    this._publicationStatus = props.publicationStatus
    this._rating = props.rating
    this._active = props.active
    this._authors = props.authors
    this._genres = props.genres
    this._demographic = props.demographic
    this._createdAt = props.createdAt
    this._updatedAt = props.updatedAt
  }

  get id(): string {
    return this._id
  }

  set id(value: string) {
    this._id = value
  }

  get originalName(): string {
    return this._originalName
  }

  set originalName(value: string) {
    this._originalName = value
  }

  get alternativeNames(): string[] | undefined {
    return this._alternativeNames
  }

  set alternativeNames(value: string[] | undefined) {
    this._alternativeNames = value
  }

  get slugName(): string {
    return this._slugName
  }

  set slugName(value: string) {
    this._slugName = value
  }

  get scrappingName(): string {
    return this._scrappingName
  }

  set scrappingName(value: string) {
    this._scrappingName = value
  }

  get sinopsis(): string {
    return this._sinopsis
  }

  set sinopsis(value: string) {
    this._sinopsis = value
  }

  get chapters(): number {
    return this._chapters
  }

  set chapters(value: number) {
    this._chapters = value
  }

  get releaseDate(): Date {
    return this._releaseDate
  }

  set releaseDate(value: Date) {
    this._releaseDate = value
  }

  get coverImage(): string {
    return this._coverImage
  }

  set coverImage(value: string) {
    this._coverImage = value
  }

  get bannerImage(): string {
    return this._bannerImage
  }

  set bannerImage(value: string) {
    this._bannerImage = value
  }

  get publicationStatus(): string {
    return this._publicationStatus
  }

  set publicationStatus(value: string) {
    this._publicationStatus = value
  }

  get rating(): number {
    return this._rating
  }

  set rating(value: number) {
    this._rating = value
  }

  get active(): boolean {
    return this._active
  }

  set active(value: boolean) {
    this._active = value
  }

  get authors(): Author[] {
    return this._authors
  }

  set authors(value: Author[]) {
    this._authors = value
  }

  get genres(): Genre[] {
    return this._genres
  }

  set genres(value: Genre[]) {
    this._genres = value
  }

  get demographic(): Demographic {
    return this._demographic
  }

  set demographic(value: Demographic) {
    this._demographic = value
  }

  get createdAt(): Date {
    return this._createdAt
  }

  set createdAt(value: Date) {
    this._createdAt = value
  }

  get updatedAt(): Date | undefined {
    return this._updatedAt
  }

  set updatedAt(value: Date | undefined) {
    this._updatedAt = value
  }
}
