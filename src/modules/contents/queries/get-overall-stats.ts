import { useErrorParser } from '@helpers'
import { logError, logQuery } from '@helpers/logger'
import { OverallStatsResponse, QueryGetIndexMetadataArgs } from '@modules-types'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'
import getDateIntervals from '@helpers/get-date-intervals'

export default async (
  _parent: unknown,
  { filters }: QueryGetIndexMetadataArgs,
  { user, sentryId, prisma }: Context & Required<Context>
): Promise<OverallStatsResponse> => {
  logQuery('getOverallStats %o', user)
  try {
    if (!user) throw new ApolloError('You must be logged in.', '401')

    const { toDate, fromDate, monthsInterval } = getDateIntervals(filters)

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

    // if (filters?.fromDate && filters?.toDate) {
    //   fromDateMethod = format(
    //     startOfMonth(parseISO(filters.fromDate)),
    //     'yyyy-MM-dd'
    //   )

    //   toDateMethod = format(endOfMonth(parseISO(filters.toDate)), 'yyyy-MM-dd')
    // }

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

    const performance = {
      totalShares: stats[0].totalShares,
      totalComments: stats[0].totalComments,
      totalLikes: stats[0].totalLikes,
      totalContents: stats[0].totalContents
    }

    const result = {
      stats,
      performance
    }

    return result
  } catch (e) {
    logError('getOverallStats %o', e)

    const message = useErrorParser(e)

    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}
