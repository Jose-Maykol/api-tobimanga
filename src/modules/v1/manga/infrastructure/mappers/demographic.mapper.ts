import { Demographic } from '../../domain/entities/demographic.entity'
import DemographicRecord from '../../domain/types/demographic'

export class DemographicMapper {
  static toDomain(demographic: DemographicRecord): Demographic {
    return new Demographic({
      id: demographic.id,
      name: demographic.name,
      createdAt: demographic.createdAt,
      updatedAt: demographic.updatedAt,
    })
  }

  static toPersistence(demographic: Demographic): DemographicRecord {
    return {
      id: demographic.getId(),
      name: demographic.getName(),
      createdAt: demographic.getCreatedAt(),
      updatedAt: demographic.getUpdatedAt(),
    }
  }
}
