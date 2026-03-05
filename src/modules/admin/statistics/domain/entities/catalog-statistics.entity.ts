export interface StatusCount {
  status: string
  count: number
}

export interface DemographicCount {
  demographic: string
  count: number
}

export interface GenreCount {
  genre: string
  count: number
}

export interface MonthlyCount {
  month: string
  count: number
}

export interface CatalogStatistics {
  totalMangas: number
  activeMangas: number
  inactiveMangas: number
  totalChapters: number
  avgChaptersPerManga: number
  totalAuthors: number
  totalGenres: number

  mangasByPublicationStatus: StatusCount[]
  mangasByDemographic: DemographicCount[]
  mangasAddedOverTime: MonthlyCount[]
  topGenres: GenreCount[]
  chaptersAddedOverTime: MonthlyCount[]
}
