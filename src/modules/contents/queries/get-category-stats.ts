import { useErrorParser } from '@helpers'
import { logError, logQuery } from '@helpers/logger'
import { QueryGetIndexMetadataArgs, OverallStatResponse } from '@modules-types'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'

import getDateIntervals from '../helpers/get-date-intervals'

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
    const statsCategory: CategoryStat[] = await prisma.$queryRawUnsafe<
      CategoryStat[]
    >(
      `
          SELECT
          ca."name",
          COUNT(c."id") "totalContents",
          SUM(c."likes") "totalLikes",
          SUM(c."comments") "totalComments",
          SUM(c."shares") "totalShares"
          
          FROM
            "Category" ca
            LEFT JOIN "Content" c ON c."categoryId" = ca."id"
          WHERE
  
              c."id" IS NOT NULL
              AND (
                ca."userId" = $1 AND c."userId" = $1
              )
              AND (
                CAST($2 AS TEXT) IS NULL OR
                ca."name" = ANY(STRING_TO_ARRAY($2, ','))
              )
              AND (
                "c"."createdAt" BETWEEN $3::TIMESTAMP AND $4::TIMESTAMP
                )
            
            GROUP BY 1
            LIMIT 1;
          
        `.clearIndentation(),
      user.id, //$1
      filters?.categories?.length ? filters?.categories?.join(',') : null, //$2
      fromDate, // $3
      toDate // $4
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
