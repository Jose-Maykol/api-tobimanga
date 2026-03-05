export interface StatusCount {
  status: string
  count: number
}

export interface MangaRanking {
  mangaName: string
  avgRating: number
  totalRatings: number
}

export interface MangaPopularity {
  mangaName: string
  readers: number
}

export interface MangaFavorite {
  mangaName: string
  favorites: number
}

export interface DailyCount {
  date: string
  chaptersRead: number
}

export interface MonthlyCount {
  month: string
  chaptersRead: number
}

export interface RatingCount {
  rating: number
  count: number
}

export interface EngagementStatistics {
  totalUserMangaEntries: number
  totalFavorites: number
  totalChaptersRead: number

  readingStatusDistribution: StatusCount[]
  topRatedMangas: MangaRanking[]
  mostPopularMangas: MangaPopularity[]
  mostFavoritedMangas: MangaFavorite[]
  readingActivityByDay: DailyCount[]
  readingActivityByMonth: MonthlyCount[]
  ratingDistribution: RatingCount[]
}
