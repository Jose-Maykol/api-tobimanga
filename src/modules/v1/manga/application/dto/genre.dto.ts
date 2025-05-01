export type GenreDto = {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date | null
}

export type GenreListDto = Pick<GenreDto, 'id' | 'name'>
