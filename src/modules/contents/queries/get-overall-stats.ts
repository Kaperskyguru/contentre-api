import { useErrorParser } from '@helpers'
import { logError, logQuery } from '@helpers/logger'
import { OverallStatsResponse, QueryGetIndexMetadataArgs } from '@modules-types'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'

export default async (
  _parent: unknown,
  { filters }: QueryGetIndexMetadataArgs,
  { user, sentryId, prisma }: Context & Required<Context>
): Promise<OverallStatsResponse> => {
  logQuery('getOverallStats %o', user)
  try {
    if (!user) throw new ApolloError('You must be logged in.', '401')

    // Growth: compares sum of total_contents, views, clicks, likes, shares, comments with previous duration (year, month, week, day)
    // Interactions: compares sum of views, clicks, likes, shares, comments with previous duration (year, month, week, day)

    type StatValues = {
      name: string
      status: string
      totalContents: number
      total: number
      lastTotal: number
      totalLikes: number
      totalComments: number
      totalShares: number
      lastTotalContents: number
    }

    const overallStats: StatValues[] = await prisma.$queryRawUnsafe(
      `
              SELECT
              client."name",
              client.status,
              COUNT(c."id") FILTER(WHERE TO_CHAR("c"."createdAt", 'YYYY')::INT = TO_CHAR(NOW()::TIMESTAMP, 'YYYY')::INT) "totalContents",
              SUM( COALESCE(c."likes",0) + COALESCE(c."comments",0) + COALESCE(c."shares",0) ) FILTER(WHERE TO_CHAR("c"."createdAt", 'YYYY')::INT = TO_CHAR(NOW()::TIMESTAMP, 'YYYY')::INT) "total",
              SUM( COALESCE(c."likes",0) + COALESCE(c."comments",0) + COALESCE(c."shares",0) ) FILTER(WHERE TO_CHAR("c"."createdAt", 'YYYY')::INT = TO_CHAR(NOW()::TIMESTAMP - '1 year'::INTERVAL, 'YYYY')::INT)  "lastTotal",
  
             
              SUM(c."likes") FILTER(WHERE TO_CHAR("c"."createdAt", 'YYYY')::INT = TO_CHAR(NOW()::TIMESTAMP, 'YYYY')::INT) "totalLikes",
              SUM(c."comments") FILTER(WHERE TO_CHAR("c"."createdAt", 'YYYY')::INT = TO_CHAR(NOW()::TIMESTAMP, 'YYYY')::INT) "totalComments",
              SUM(c."shares") FILTER(WHERE TO_CHAR("c"."createdAt", 'YYYY')::INT = TO_CHAR(NOW()::TIMESTAMP, 'YYYY')::INT) "totalShares",
  
              COUNT(c."id") FILTER(WHERE TO_CHAR("c"."createdAt", 'YYYY')::INT = TO_CHAR(NOW()::TIMESTAMP - '1 year'::INTERVAL, 'YYYY')::INT) "lastTotalContents"
              
          
              FROM
                "Content" c
                LEFT JOIN "Client" client ON c."clientId" = client."id"
              WHERE
                (
                  c."userId" = $1
                ) 
                GROUP BY 1,2;
             
            `.clearIndentation(),
      user.id
    )

    type CategoryStat = {
      name: string
      totalContents: number
      totalLikes: number
      totalComments: number
      totalShares: number
    }
    // Get Content by Category
    const statsCategory: CategoryStat[] = await prisma.$queryRawUnsafe<
      CategoryStat[]
    >(
      `
                SELECT
                ca."name",
                COUNT(c."id") FILTER(WHERE TO_CHAR("c"."createdAt", 'YYYY')::INT = TO_CHAR(NOW()::TIMESTAMP, 'YYYY')::INT) "totalContents",
                SUM(c."likes") FILTER(WHERE TO_CHAR("c"."createdAt", 'YYYY')::INT = TO_CHAR(NOW()::TIMESTAMP, 'YYYY')::INT) "totalLikes",
                SUM(c."comments") FILTER(WHERE TO_CHAR("c"."createdAt", 'YYYY')::INT = TO_CHAR(NOW()::TIMESTAMP, 'YYYY')::INT) "totalComments",
                SUM(c."shares") FILTER(WHERE TO_CHAR("c"."createdAt", 'YYYY')::INT = TO_CHAR(NOW()::TIMESTAMP, 'YYYY')::INT) "totalShares"
                
                FROM
                  "Content" c
                  LEFT JOIN "Category" ca ON c."categoryId" = ca."id"
                WHERE
                  (
                    ca."userId" = $1 AND c."userId" = $1
                  ) 
                  
                  GROUP BY 1
                  LIMIT 1;
               
              `.clearIndentation(),
      user.id
      // Add Category
    )

    console.log(statsCategory)

    const stats = overallStats.map((val) => {
      const totalGrowth = (val.total ?? 0) + (val.totalContents ?? 0)
      const lastTotalGrowth =
        (val.lastTotal ?? 0) + (val.lastTotalContents ?? 0)
      const subGrowth =
        ((totalGrowth - lastTotalGrowth) / lastTotalGrowth) * 100

      const interactions = ((val.total - val.lastTotal) / val.lastTotal) * 100

      return {
        interactions: !Number.isFinite(interactions) ? 100 : interactions,
        growth: !Number.isFinite(subGrowth) ? 100 : subGrowth,
        name: val.name,
        status: val.status,
        totalShares: val.totalShares,
        totalComments: val.totalComments,
        totalLikes: val.totalLikes,
        totalContents: val.totalContents
      }
    })

    const overallPerformance = overallStats.map((val) => ({
      totalShares: val.totalShares,
      totalComments: val.totalComments,
      totalLikes: val.totalLikes,
      totalContents: val.totalContents
    }))

    const result = {
      stats,
      performance: overallPerformance[0],
      categoryStat: statsCategory[0]
    }

    return result
  } catch (e) {
    logError('getOverallStats %o', e)

    const message = useErrorParser(e)

    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}
