export type DemographicDto = {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date | null
}

export type DemographicListDto = Pick<DemographicDto, 'id' | 'name'>
