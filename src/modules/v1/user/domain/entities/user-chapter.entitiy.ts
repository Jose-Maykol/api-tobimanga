import UserChapterRecord from '../../../user/domain/types/user-chapter'

export class UserChapter {
  private _userId: string
  private _chapterId: string
  private _read: boolean
  private _readAt: Date
  private _createdAt: Date
  private _updatedAt: Date | null

  constructor(props: UserChapterRecord) {
    this.userId = props.userId
    this.chapterId = props.chapterId
    this.read = props.read
    this.readAt = props.readAt
    this.createdAt = props.createdAt
    this.updatedAt = props.updatedAt
  }

  public get userId(): string {
    return this._userId
  }

  public set userId(value: string) {
    this._userId = value
  }

  public get chapterId(): string {
    return this._chapterId
  }

  public set chapterId(value: string) {
    this._chapterId = value
  }

  public get read(): boolean {
    return this._read
  }

  public set read(value: boolean) {
    this._read = value
  }

  public get readAt(): Date {
    return this._readAt
  }

  public set readAt(value: Date) {
    this._readAt = value
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
