import { useErrorParser } from '@helpers'
import { logError, logQuery } from '@helpers/logger'
import { QueryGetIndexMetadataArgs, OverallStatResponse } from '@modules-types'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'

import getDateIntervals from '@helpers/get-date-intervals'
import whereContentRaw from '../helpers/where-contents-raw'

export default async (
  _parent: unknown,
  { filters }: QueryGetIndexMetadataArgs,
  { user, sentryId, prisma }: Context & Required<Context>
): Promise<OverallStatResponse> => {
  logQuery('getCategoryStats %o', user)
  try {
    if (!user) throw new ApolloError('You must be logged in.', '401')

    const { toDate, fromDate } = getDateIntervals(filters)

    type CategoryStat = {
      name: string
      totalContents: number
      totalLikes: number
      totalComments: number
      totalShares: number
    }
    // Get Content by Category
    const { query, args } = whereContentRaw(user, filters)
    const statsCategory: CategoryStat[] = await prisma.$queryRawUnsafe<
      CategoryStat[]
    >(
      `
          SELECT
          cat."name",
          COUNT(c."id") "totalContents",
          SUM(c."likes") "totalLikes",
          SUM(c."comments") "totalComments",
          SUM(c."shares") "totalShares"
          
          FROM
            "Category" cat LEFT JOIN
            "Content" c ON c."categoryId" = cat."id" LEFT JOIN
            "Client" cl ON c."categoryId" = cl."id"
          WHERE
  
              c."id" IS NOT NULL


                ${query}
            
            GROUP BY 1
            LIMIT 1;
          
        `.clearIndentation(),
      ...args
    )

    const categoryStats = statsCategory.map((val) => ({
      name: val.name,
      totalShares: val.totalShares ?? 0,
      totalComments: val.totalComments ?? 0,
      totalLikes: val.totalLikes ?? 0,
      totalContents: val.totalContents ?? 0
    }))

    return categoryStats[0]
  } catch (e) {
    logError('getCategoryStats %o', e)

    const message = useErrorParser(e)

    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}
