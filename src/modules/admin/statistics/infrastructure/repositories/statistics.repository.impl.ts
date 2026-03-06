import { and, avg, count, desc, eq, gte, sql } from 'drizzle-orm'

import { Inject, Injectable } from '@nestjs/common'

import { DATABASE_SERVICE } from '@/core/database/constants/database.constants'
import { authors } from '@/core/database/schemas/author.schema'
import { chapters } from '@/core/database/schemas/chapter.schema'
import { cronJobs } from '@/core/database/schemas/cron-job.schema'
import { cronJobExecutions } from '@/core/database/schemas/cron-job-execution.schema'
import { demographics } from '@/core/database/schemas/demographic.schema'
import { genres } from '@/core/database/schemas/genres.schema'
import { mangas } from '@/core/database/schemas/manga.schema'
import { mangaGenres } from '@/core/database/schemas/manga-genre.schema'
import { uploads } from '@/core/database/schemas/upload.schema'
import { users } from '@/core/database/schemas/user.schema'
import { userChapterProgress } from '@/core/database/schemas/user-chapter-progress.schema'
import { userMangas } from '@/core/database/schemas/user-manga.schema'
import { DatabaseService } from '@/core/database/services/database.service'

import { CatalogStatistics } from '../../domain/entities/catalog-statistics.entity'
import { EngagementStatistics } from '../../domain/entities/engagement-statistics.entity'
import { SystemStatistics } from '../../domain/entities/system-statistics.entity'
import { UploadStatistics } from '../../domain/entities/upload-statistics.entity'
import { UserStatistics } from '../../domain/entities/user-statistics.entity'
import { StatisticsRepository } from '../../domain/repositories/statistics.repository'

@Injectable()
export class StatisticsRepositoryImpl implements StatisticsRepository {
  constructor(
    @Inject(DATABASE_SERVICE)
    private readonly db: DatabaseService,
  ) {}

  async getCatalogStatistics(): Promise<CatalogStatistics> {
    const twelveMonthsAgo = new Date()
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12)

    const [
      mangaCounts,
      chapterCounts,
      authorCount,
      genreCount,
      byPublicationStatus,
      byDemographic,
      mangasOverTime,
      topGenresResult,
      chaptersOverTime,
    ] = await Promise.all([
      // Total, active, inactive mangas
      this.db.client
        .select({
          total: count(),
          active: count(sql`CASE WHEN ${mangas.active} = true THEN 1 END`),
        })
        .from(mangas),

      // Total chapters + average per manga
      this.db.client
        .select({
          total: sql<number>`SUM(manga_chapter_count.chapter_count)::int`,
          avgPerManga: avg(sql`manga_chapter_count.chapter_count`),
        })
        .from(
          sql`(SELECT ${chapters.mangaId}, COUNT(*) as chapter_count FROM ${chapters} GROUP BY ${chapters.mangaId}) AS manga_chapter_count`,
        ),

      // Total authors
      this.db.client.select({ value: count() }).from(authors),

      // Total genres
      this.db.client.select({ value: count() }).from(genres),

      // Mangas by publication status
      this.db.client
        .select({
          status: mangas.publicationStatus,
          count: count(),
        })
        .from(mangas)
        .groupBy(mangas.publicationStatus)
        .orderBy(desc(count())),

      // Mangas by demographic
      this.db.client
        .select({
          demographic: demographics.name,
          count: count(),
        })
        .from(mangas)
        .innerJoin(demographics, eq(mangas.demographicId, demographics.id))
        .groupBy(demographics.name)
        .orderBy(desc(count())),

      // Mangas added over time (last 12 months)
      this.db.client
        .select({
          month: sql<string>`TO_CHAR(${mangas.createdAt}, 'YYYY-MM')`,
          count: count(),
        })
        .from(mangas)
        .where(gte(mangas.createdAt, twelveMonthsAgo))
        .groupBy(sql`TO_CHAR(${mangas.createdAt}, 'YYYY-MM')`)
        .orderBy(sql`TO_CHAR(${mangas.createdAt}, 'YYYY-MM')`),

      // Top 10 genres
      this.db.client
        .select({
          genre: genres.name,
          count: count(),
        })
        .from(mangaGenres)
        .innerJoin(genres, eq(mangaGenres.genreId, genres.id))
        .groupBy(genres.name)
        .orderBy(desc(count()))
        .limit(10),

      // Chapters added over time (last 12 months)
      this.db.client
        .select({
          month: sql<string>`TO_CHAR(${chapters.createdAt}, 'YYYY-MM')`,
          count: count(),
        })
        .from(chapters)
        .where(gte(chapters.createdAt, twelveMonthsAgo))
        .groupBy(sql`TO_CHAR(${chapters.createdAt}, 'YYYY-MM')`)
        .orderBy(sql`TO_CHAR(${chapters.createdAt}, 'YYYY-MM')`),
    ])

    const totalMangas = Number(mangaCounts[0]?.total ?? 0)
    const activeMangas = Number(mangaCounts[0]?.active ?? 0)
    const totalChapters = Number(chapterCounts[0]?.total ?? 0)

    return {
      totalMangas,
      activeMangas,
      inactiveMangas: totalMangas - activeMangas,
      totalChapters,
      avgChaptersPerManga: Number(
        Number(chapterCounts[0]?.avgPerManga ?? 0).toFixed(1),
      ),
      totalAuthors: Number(authorCount[0]?.value ?? 0),
      totalGenres: Number(genreCount[0]?.value ?? 0),
      mangasByPublicationStatus: byPublicationStatus.map((row) => ({
        status: row.status,
        count: Number(row.count),
      })),
      mangasByDemographic: byDemographic.map((row) => ({
        demographic: row.demographic,
        count: Number(row.count),
      })),
      mangasAddedOverTime: mangasOverTime.map((row) => ({
        month: row.month,
        count: Number(row.count),
      })),
      topGenres: topGenresResult.map((row) => ({
        genre: row.genre,
        count: Number(row.count),
      })),
      chaptersAddedOverTime: chaptersOverTime.map((row) => ({
        month: row.month,
        count: Number(row.count),
      })),
    }
  }

  async getUserStatistics(): Promise<UserStatistics> {
    const twelveMonthsAgo = new Date()
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12)

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const [userCounts, byRole, byMonth, byDay] = await Promise.all([
      // Total, active, inactive
      this.db.client
        .select({
          total: count(),
          active: count(sql`CASE WHEN ${users.isActive} = true THEN 1 END`),
        })
        .from(users),

      // Users by role
      this.db.client.execute(
        sql`SELECT unnest(${users.roles}) AS role, COUNT(*) AS count FROM ${users} GROUP BY role ORDER BY count DESC`,
      ),

      // Registrations by month (last 12 months)
      this.db.client
        .select({
          month: sql<string>`TO_CHAR(${users.createdAt}, 'YYYY-MM')`,
          count: count(),
        })
        .from(users)
        .where(gte(users.createdAt, twelveMonthsAgo))
        .groupBy(sql`TO_CHAR(${users.createdAt}, 'YYYY-MM')`)
        .orderBy(sql`TO_CHAR(${users.createdAt}, 'YYYY-MM')`),

      // Registrations by day (last 30 days)
      this.db.client
        .select({
          date: sql<string>`TO_CHAR(${users.createdAt}, 'YYYY-MM-DD')`,
          count: count(),
        })
        .from(users)
        .where(gte(users.createdAt, thirtyDaysAgo))
        .groupBy(sql`TO_CHAR(${users.createdAt}, 'YYYY-MM-DD')`)
        .orderBy(sql`TO_CHAR(${users.createdAt}, 'YYYY-MM-DD')`),
    ])

    const totalUsers = Number(userCounts[0]?.total ?? 0)
    const activeUsers = Number(userCounts[0]?.active ?? 0)
    const inactiveUsers = totalUsers - activeUsers

    return {
      totalUsers,
      activeUsers,
      inactiveUsers,
      usersByRole: (byRole.rows as { role: string; count: string }[]).map(
        (row) => ({
          role: row.role,
          count: Number(row.count),
        }),
      ),
      activeVsInactive: [
        { status: 'Activos', count: activeUsers },
        { status: 'Inactivos', count: inactiveUsers },
      ],
      registrationsByMonth: byMonth.map((row) => ({
        month: row.month,
        count: Number(row.count),
      })),
      registrationsByDay: byDay.map((row) => ({
        date: row.date,
        count: Number(row.count),
      })),
    }
  }

  async getEngagementStatistics(): Promise<EngagementStatistics> {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const twelveMonthsAgo = new Date()
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12)

    const [
      entryCounts,
      chaptersReadCount,
      byReadingStatus,
      topRated,
      mostPopular,
      mostFavorited,
      activityByDay,
      activityByMonth,
      ratingDist,
    ] = await Promise.all([
      // Total entries + favorites
      this.db.client
        .select({
          total: count(),
          favorites: count(
            sql`CASE WHEN ${userMangas.isFavorite} = true THEN 1 END`,
          ),
        })
        .from(userMangas),

      // Total chapters read
      this.db.client.select({ value: count() }).from(userChapterProgress),

      // Reading status distribution
      this.db.client
        .select({
          status: userMangas.readingStatus,
          count: count(),
        })
        .from(userMangas)
        .groupBy(userMangas.readingStatus)
        .orderBy(desc(count())),

      // Top 10 rated mangas
      this.db.client
        .select({
          mangaName: mangas.originalName,
          avgRating: avg(userMangas.rating),
          totalRatings: count(),
        })
        .from(userMangas)
        .innerJoin(mangas, eq(userMangas.mangaId, mangas.id))
        .where(sql`${userMangas.rating} IS NOT NULL`)
        .groupBy(mangas.id, mangas.originalName)
        .orderBy(desc(avg(userMangas.rating)))
        .limit(10),

      // Top 10 most popular (most readers)
      this.db.client
        .select({
          mangaName: mangas.originalName,
          readers: count(),
        })
        .from(userMangas)
        .innerJoin(mangas, eq(userMangas.mangaId, mangas.id))
        .groupBy(mangas.id, mangas.originalName)
        .orderBy(desc(count()))
        .limit(10),

      // Top 10 most favorited
      this.db.client
        .select({
          mangaName: mangas.originalName,
          favorites: count(),
        })
        .from(userMangas)
        .innerJoin(mangas, eq(userMangas.mangaId, mangas.id))
        .where(eq(userMangas.isFavorite, true))
        .groupBy(mangas.id, mangas.originalName)
        .orderBy(desc(count()))
        .limit(10),

      // Reading activity by day (last 30 days)
      this.db.client
        .select({
          date: sql<string>`TO_CHAR(${userChapterProgress.readAt}, 'YYYY-MM-DD')`,
          chaptersRead: count(),
        })
        .from(userChapterProgress)
        .where(gte(userChapterProgress.readAt, thirtyDaysAgo))
        .groupBy(sql`TO_CHAR(${userChapterProgress.readAt}, 'YYYY-MM-DD')`)
        .orderBy(sql`TO_CHAR(${userChapterProgress.readAt}, 'YYYY-MM-DD')`),

      // Reading activity by month (last 12 months)
      this.db.client
        .select({
          month: sql<string>`TO_CHAR(${userChapterProgress.readAt}, 'YYYY-MM')`,
          chaptersRead: count(),
        })
        .from(userChapterProgress)
        .where(gte(userChapterProgress.readAt, twelveMonthsAgo))
        .groupBy(sql`TO_CHAR(${userChapterProgress.readAt}, 'YYYY-MM')`)
        .orderBy(sql`TO_CHAR(${userChapterProgress.readAt}, 'YYYY-MM')`),

      // Rating distribution
      this.db.client
        .select({
          rating: userMangas.rating,
          count: count(),
        })
        .from(userMangas)
        .where(sql`${userMangas.rating} IS NOT NULL`)
        .groupBy(userMangas.rating)
        .orderBy(userMangas.rating),
    ])

    return {
      totalUserMangaEntries: Number(entryCounts[0]?.total ?? 0),
      totalFavorites: Number(entryCounts[0]?.favorites ?? 0),
      totalChaptersRead: Number(chaptersReadCount[0]?.value ?? 0),
      readingStatusDistribution: byReadingStatus.map((row) => ({
        status: row.status,
        count: Number(row.count),
      })),
      topRatedMangas: topRated.map((row) => ({
        mangaName: row.mangaName,
        avgRating: Number(Number(row.avgRating).toFixed(1)),
        totalRatings: Number(row.totalRatings),
      })),
      mostPopularMangas: mostPopular.map((row) => ({
        mangaName: row.mangaName,
        readers: Number(row.readers),
      })),
      mostFavoritedMangas: mostFavorited.map((row) => ({
        mangaName: row.mangaName,
        favorites: Number(row.favorites),
      })),
      readingActivityByDay: activityByDay.map((row) => ({
        date: row.date,
        chaptersRead: Number(row.chaptersRead),
      })),
      readingActivityByMonth: activityByMonth.map((row) => ({
        month: row.month,
        chaptersRead: Number(row.chaptersRead),
      })),
      ratingDistribution: ratingDist.map((row) => ({
        rating: Number(row.rating),
        count: Number(row.count),
      })),
    }
  }

  async getUploadStatistics(): Promise<UploadStatistics> {
    const twelveMonthsAgo = new Date()
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12)

    const [totalResult, byStatus, overTime] = await Promise.all([
      // Total + pending
      this.db.client
        .select({
          total: count(),
          pending: count(
            sql`CASE WHEN ${uploads.status} = 'PENDING' THEN 1 END`,
          ),
        })
        .from(uploads),

      // By status
      this.db.client
        .select({
          status: uploads.status,
          count: count(),
        })
        .from(uploads)
        .groupBy(uploads.status)
        .orderBy(desc(count())),

      // Over time (last 12 months)
      this.db.client
        .select({
          month: sql<string>`TO_CHAR(${uploads.createdAt}, 'YYYY-MM')`,
          count: count(),
        })
        .from(uploads)
        .where(gte(uploads.createdAt, twelveMonthsAgo))
        .groupBy(sql`TO_CHAR(${uploads.createdAt}, 'YYYY-MM')`)
        .orderBy(sql`TO_CHAR(${uploads.createdAt}, 'YYYY-MM')`),
    ])

    return {
      totalUploads: Number(totalResult[0]?.total ?? 0),
      pendingUploads: Number(totalResult[0]?.pending ?? 0),
      uploadsByStatus: byStatus.map((row) => ({
        status: row.status as string,
        count: Number(row.count),
      })),
      uploadsOverTime: overTime.map((row) => ({
        month: row.month,
        count: Number(row.count),
      })),
    }
  }

  async getSystemStatistics(): Promise<SystemStatistics> {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const twentyFourHoursAgo = new Date()
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24)

    const [
      jobCounts,
      failedLast24h,
      avgDuration,
      byStatus,
      overTime,
      durationTrend,
    ] = await Promise.all([
      // Total + active cron jobs
      this.db.client
        .select({
          total: count(),
          active: count(sql`CASE WHEN ${cronJobs.isActive} = true THEN 1 END`),
        })
        .from(cronJobs),

      // Failed in last 24h
      this.db.client
        .select({ value: count() })
        .from(cronJobExecutions)
        .where(
          and(
            eq(cronJobExecutions.status, 'FAILED'),
            gte(cronJobExecutions.startedAt, twentyFourHoursAgo),
          ),
        ),

      // Avg execution duration (completed only)
      this.db.client
        .select({ value: avg(cronJobExecutions.durationMs) })
        .from(cronJobExecutions)
        .where(eq(cronJobExecutions.status, 'COMPLETED')),

      // Executions by status (last 30 days)
      this.db.client
        .select({
          status: cronJobExecutions.status,
          count: count(),
        })
        .from(cronJobExecutions)
        .where(gte(cronJobExecutions.startedAt, thirtyDaysAgo))
        .groupBy(cronJobExecutions.status)
        .orderBy(desc(count())),

      // Executions over time (last 30 days, by day, split by completed/failed)
      this.db.client
        .select({
          date: sql<string>`TO_CHAR(${cronJobExecutions.startedAt}, 'YYYY-MM-DD')`,
          completed: count(
            sql`CASE WHEN ${cronJobExecutions.status} = 'COMPLETED' THEN 1 END`,
          ),
          failed: count(
            sql`CASE WHEN ${cronJobExecutions.status} = 'FAILED' THEN 1 END`,
          ),
        })
        .from(cronJobExecutions)
        .where(gte(cronJobExecutions.startedAt, thirtyDaysAgo))
        .groupBy(sql`TO_CHAR(${cronJobExecutions.startedAt}, 'YYYY-MM-DD')`)
        .orderBy(sql`TO_CHAR(${cronJobExecutions.startedAt}, 'YYYY-MM-DD')`),

      // Duration trend (last 30 days)
      this.db.client
        .select({
          date: sql<string>`TO_CHAR(${cronJobExecutions.startedAt}, 'YYYY-MM-DD')`,
          avgDurationMs: avg(cronJobExecutions.durationMs),
        })
        .from(cronJobExecutions)
        .where(
          and(
            eq(cronJobExecutions.status, 'COMPLETED'),
            gte(cronJobExecutions.startedAt, thirtyDaysAgo),
          ),
        )
        .groupBy(sql`TO_CHAR(${cronJobExecutions.startedAt}, 'YYYY-MM-DD')`)
        .orderBy(sql`TO_CHAR(${cronJobExecutions.startedAt}, 'YYYY-MM-DD')`),
    ])

    return {
      totalCronJobs: Number(jobCounts[0]?.total ?? 0),
      activeCronJobs: Number(jobCounts[0]?.active ?? 0),
      failedExecutionsLast24h: Number(failedLast24h[0]?.value ?? 0),
      avgExecutionDurationMs: Number(
        Number(avgDuration[0]?.value ?? 0).toFixed(0),
      ),
      executionsByStatus: byStatus.map((row) => ({
        status: row.status,
        count: Number(row.count),
      })),
      executionsOverTime: overTime.map((row) => ({
        date: row.date,
        completed: Number(row.completed),
        failed: Number(row.failed),
      })),
      executionDurationTrend: durationTrend.map((row) => ({
        date: row.date,
        avgDurationMs: Number(Number(row.avgDurationMs).toFixed(0)),
      })),
    }
  }
}
