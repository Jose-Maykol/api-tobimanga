import { MangaReadingStatus } from '../enums/manga-reading-status.enum'
import UserMangaRecord from '../types/user-manga'

type UserMangaProps = UserMangaRecord

export class UserManga {
  private _userId: string
  private _mangaUniqueId: string
  private _rating: number | 0
  private _readingStatus: MangaReadingStatus
  private _createdAt: Date
  private _updatedAt: Date | null

  constructor(props: UserMangaProps) {
    this.userId = props.userId
    this.mangaId = props.mangaId
    this.rating = props.rating
    this.readingStatus = props.readingStatus
    this.createdAt = new Date()
  }

  public get userId(): string {
    return this._userId
  }
  public set userId(value: string) {
    this._userId = value
  }

  public get mangaId(): string {
    return this._mangaUniqueId
  }
  public set mangaId(value: string) {
    this._mangaUniqueId = value
  }

  public get rating(): number | 0 {
    return this._rating
  }
  public set rating(value: number | 0) {
    this._rating = value
  }

  public get readingStatus(): MangaReadingStatus {
    return this._readingStatus
  }
  public set readingStatus(value: MangaReadingStatus) {
    this._readingStatus = value
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
