import MangaRecord from '../types/manga'
import { Author } from './author.entity'
import { Demographic } from './demographic.entity'
import { Genre } from './genre.entity'

type MangaProps = Omit<MangaRecord, 'authors' | 'genres' | 'demographic'>

export class Manga {
  private _id: string
  private _originalName: string
  private _alternativeNames: string[] | null
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
  private _updatedAt: Date | null

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

  public get id(): string {
    return this._id
  }

  public set id(value: string) {
    this._id = value
  }

  public get originalName(): string {
    return this._originalName
  }

  public set originalName(value: string) {
    this._originalName = value
  }

  public get alternativeNames(): string[] | null {
    return this._alternativeNames
  }

  public set alternativeNames(value: string[] | null) {
    this._alternativeNames = value
  }

  public get slugName(): string {
    return this._slugName
  }

  public set slugName(value: string) {
    this._slugName = value
  }

  public get scrappingName(): string {
    return this._scrappingName
  }

  public set scrappingName(value: string) {
    this._scrappingName = value
  }

  public get sinopsis(): string {
    return this._sinopsis
  }

  public set sinopsis(value: string) {
    this._sinopsis = value
  }

  public get chapters(): number {
    return this._chapters
  }

  public set chapters(value: number) {
    this._chapters = value
  }

  public get releaseDate(): Date {
    return this._releaseDate
  }

  public set releaseDate(value: Date) {
    this._releaseDate = value
  }

  public get coverImage(): string {
    return this._coverImage
  }

  public set coverImage(value: string) {
    this._coverImage = value
  }

  public get bannerImage(): string {
    return this._bannerImage
  }

  public set bannerImage(value: string) {
    this._bannerImage = value
  }

  public get publicationStatus(): string {
    return this._publicationStatus
  }

  public set publicationStatus(value: string) {
    this._publicationStatus = value
  }

  public get rating(): number {
    return this._rating
  }

  public set rating(value: number) {
    this._rating = value
  }

  public get active(): boolean {
    return this._active
  }

  public set active(value: boolean) {
    this._active = value
  }

  public get authors(): Author[] {
    return this._authors
  }

  public set authors(value: Author[]) {
    this._authors = value
  }

  public get genres(): Genre[] {
    return this._genres
  }

  public set genres(value: Genre[]) {
    this._genres = value
  }

  public get demographic(): Demographic {
    return this._demographic
  }

  public set demographic(value: Demographic) {
    this._demographic = value
  }

  public get createdAt(): Date {
    return this._createdAt
  }

  public set createdAt(value: Date) {
    this._createdAt = value
  }

  public get updatedAt(): Date | null {
    return this._updatedAt
  }

  public set updatedAt(value: Date | null) {
    this._updatedAt = value
  }
}
