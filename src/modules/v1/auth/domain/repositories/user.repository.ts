export interface UserRepository {
  find(): Promise<any[]>
  findById(id: string): Promise<any>
  findByEmail(email: string): Promise<any>
  findByUsername(username: string): Promise<any>
  exists(email: string): Promise<boolean>
  save(user: any): Promise<{ id: string }>
}
