import { useErrorParser } from '@helpers'
import { logError, logQuery } from '@helpers/logger'
import { OverallStatsResponse, QueryGetIndexMetadataArgs } from '@modules-types'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'
import whereContentRaw from '../helpers/where-contents-raw'

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

    interface StatValues {
      name: string
      status: string
      totalContents: number
      total: number
      lastTotal: number
      totalLikes: number
      totalComments: number
      totalShares: number
      lastTotalContents: number
      totalInteractions: number
      totalAmount: number

      amount: number
      interactions: number
      contents: number
    }

    const { query, args } = whereContentRaw(user, filters)

    const overallStats: StatValues[] = await prisma.$queryRawUnsafe(
      `
              SELECT
              cl."name",
              cl.status,
              CASE WHEN cl."name" IS NOT NULL THEN COUNT(c."id") FILTER(WHERE TO_CHAR("c"."publishedDate", 'YYYY')::INT = TO_CHAR(NOW()::TIMESTAMP, 'YYYY')::INT) ELSE COUNT(c."id") END "totalContents",
              SUM( COALESCE(c."likes",0) + COALESCE(c."comments",0) + COALESCE(c."shares",0) ) FILTER(WHERE TO_CHAR("c"."publishedDate", 'YYYY')::INT = TO_CHAR(NOW()::TIMESTAMP, 'YYYY')::INT) "total",
              SUM( COALESCE(c."likes",0) + COALESCE(c."comments",0) + COALESCE(c."shares",0) ) FILTER(WHERE TO_CHAR("c"."publishedDate", 'YYYY')::INT = TO_CHAR(NOW()::TIMESTAMP - '1 year'::INTERVAL, 'YYYY')::INT)  "lastTotal",
  
             
              SUM(c."likes") FILTER(WHERE TO_CHAR("c"."publishedDate", 'YYYY')::INT = TO_CHAR(NOW()::TIMESTAMP, 'YYYY')::INT) "totalLikes",
              SUM(c."comments") FILTER(WHERE TO_CHAR("c"."publishedDate", 'YYYY')::INT = TO_CHAR(NOW()::TIMESTAMP, 'YYYY')::INT) "totalComments",
              SUM(c."shares") FILTER(WHERE TO_CHAR("c"."publishedDate", 'YYYY')::INT = TO_CHAR(NOW()::TIMESTAMP, 'YYYY')::INT) "totalShares",
  
              COUNT(c."id") FILTER(WHERE TO_CHAR("c"."publishedDate", 'YYYY')::INT = TO_CHAR(NOW()::TIMESTAMP - '1 year'::INTERVAL, 'YYYY')::INT) "lastTotalContents"
              
          
              FROM
                "Content" c LEFT JOIN
                "Category" cat ON c."categoryId" = cat."id" LEFT JOIN
                "Client" cl ON c."clientId" = cl."id"
              WHERE
                
                c."id" IS NOT NULL
                ${query}
                GROUP BY 1,2;
             
            `.clearIndentation(),
      ...args
    )

    const clientsStats: StatValues[] = await prisma.$queryRawUnsafe(
      `
              SELECT

                SUM(c."amount") "totalAmount",
                SUM(COALESCE(c."likes",0) + COALESCE(c."comments",0) + COALESCE(c."shares", 0)) "totalInteractions",
                COUNT(c."id") "totalContents"
              FROM
                "Content" c LEFT JOIN
                "Category" cat ON c."categoryId" = cat."id" LEFT JOIN
                "Client" cl ON c."clientId" = cl."id"
              WHERE
                c."id" IS NOT NULL
                ${query}

             
            `.clearIndentation(),
      ...args
    )

    const performance = clientsStats.map((val) => ({
      totalContents: val.totalContents ?? 0,
      totalAmount: val.totalAmount ?? 0,
      totalInteractions: val.totalInteractions ?? 0
    }))

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
        name: val?.name ?? 'Personal',
        status: val?.status ?? 'ACTIVE',
        totalShares: val.totalShares || 0,
        totalComments: val.totalComments || 0,
        totalLikes: val.totalLikes || 0,
        totalContents: val.totalContents || 0
      }
    })

    const result = {
      stats,
      performance: performance[0]
    }

    return result
  } catch (e) {
    logError('getOverallStats %o', e)

    const message = useErrorParser(e)

    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}
