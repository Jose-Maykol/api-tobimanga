import { Demographic } from '../entities/demographic.entity'

export interface DemographicRepository {
  findAll(): Promise<Demographic[]>
  findById(id: string): Promise<Demographic | null>
}
