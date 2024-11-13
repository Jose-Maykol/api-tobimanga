export interface AuthorRepository {
  find(): Promise<any[]>
  findById(id: string): Promise<any>
  findByIds(ids: string[]): Promise<any[]>
  exists(name: string): Promise<boolean>
  save(name: string): Promise<{ id: string }>
}
