import { Demographic } from '../entities/demographic.entity'

export interface DemographicRepository {
  findAll(): Promise<Demographic[] | null>
  findById(id: string): Promise<Demographic | null>
  save(demographic: Demographic): Promise<Demographic>
}
