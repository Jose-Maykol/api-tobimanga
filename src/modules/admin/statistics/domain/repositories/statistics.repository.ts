import { CatalogStatistics } from '../entities/catalog-statistics.entity'
import { EngagementStatistics } from '../entities/engagement-statistics.entity'
import { SystemStatistics } from '../entities/system-statistics.entity'
import { UploadStatistics } from '../entities/upload-statistics.entity'
import { UserStatistics } from '../entities/user-statistics.entity'

export interface StatisticsRepository {
  getCatalogStatistics(): Promise<CatalogStatistics>
  getUserStatistics(): Promise<UserStatistics>
  getEngagementStatistics(): Promise<EngagementStatistics>
  getUploadStatistics(): Promise<UploadStatistics>
  getSystemStatistics(): Promise<SystemStatistics>
}
