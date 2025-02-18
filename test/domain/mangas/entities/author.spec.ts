import { InvalidAuthorException } from '@/modules/v1/manga/domain/exceptions/invalid-author.exception'
import { Author } from '@/modules/v1/manga/domain/entities/author.entity'
import AuthorRecord from '@/modules/v1/manga/domain/types/author'

describe('Author Entity', () => {
  const validAuthorProps: AuthorRecord = {
    id: '1',
    name: 'Author Name',
    createdAt: new Date(),
    updatedAt: null,
  }

  let author: Author

  beforeEach(() => {
    author = new Author(validAuthorProps)
  })

  it('should create an author with valid properties', () => {
    expect(author.getId()).toBe(validAuthorProps.id)
    expect(author.getName()).toBe(validAuthorProps.name)
    expect(author.getCreatedAt()).toBe(validAuthorProps.createdAt)
    expect(author.getUpdatedAt()).toBeNull()
  })

  it('should update the author name', () => {
    const newName = 'New Author Name'
    author.setName(newName)
    expect(author.getName()).toBe(newName)
  })

  it('should update the updatedAt property', () => {
    const newUpdatedAt = new Date()
    author.setUpdatedAt(newUpdatedAt)
    expect(author.getUpdatedAt()).toBe(newUpdatedAt)
  })

  it('should throw an error if name is empty', () => {
    const invalidName = ' '
    expect(() => author.validateName(invalidName)).toThrow(
      InvalidAuthorException,
    )
    expect(() => author.validateName(invalidName)).toThrow(
      'El nombre del autor es requerido',
    )
  })

  it('should throw an error if name exceeds 100 characters', () => {
    const invalidName = 'a'.repeat(101)
    expect(() => author.validateName(invalidName)).toThrow(
      InvalidAuthorException,
    )
    expect(() => author.validateName(invalidName)).toThrow(
      'El nombre del autor no puede exceder los 100 caracteres',
    )
  })

  it('should not throw an error for valid name', () => {
    const validName = 'Valid Author Name'
    expect(() => author.validateName(validName)).not.toThrow()
  })
})
