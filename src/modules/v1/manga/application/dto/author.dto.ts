export type AuthorDto = {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date | null
}

export type AuthorListDto = Pick<AuthorDto, 'id' | 'name'>
