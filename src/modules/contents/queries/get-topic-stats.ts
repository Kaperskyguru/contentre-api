import { useErrorParser } from '@helpers'
import { logError, logQuery } from '@helpers/logger'
import { QueryGetIndexMetadataArgs, OverallStatResponse } from '@modules-types'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'

import getDateIntervals from '@helpers/get-date-intervals'

export default async (
  _parent: unknown,
  { filters }: QueryGetIndexMetadataArgs,
  { user, sentryId, prisma }: Context & Required<Context>
): Promise<OverallStatResponse> => {
  logQuery('getTopicsStats %o', user)
  try {
    if (!user) throw new ApolloError('You must be logged in.', '401')

    const { toDate, fromDate } = getDateIntervals(filters)

    type TopicStat = {
      name: string
      totalContents: number
      totalLikes: number
      totalComments: number
      totalShares: number
    }
    // Get Content by topics
    const statsTopic: TopicStat[] = await prisma.$queryRawUnsafe<TopicStat[]>(
      `
          SELECT
          t."name",
          COUNT(c."id") "totalContents",
          SUM(c."likes") "totalLikes",
          SUM(c."comments") "totalComments",
          SUM(c."shares") "totalShares"
          
          FROM
            "Topic" t
            LEFT JOIN "Content" c ON c."id" = t."contentId"
          WHERE
  
              c."id" IS NOT NULL AND c."notebookId" IS NULL
              AND (
                c."teamId" = $1
              )
              AND (
                CAST($2 AS TEXT) IS NULL OR
                t."id" = $2
              )
              AND (
                "c"."publishedDate" BETWEEN $3::TIMESTAMP AND $4::TIMESTAMP
                )
            
            GROUP BY 1
            LIMIT 1;
          
        `.clearIndentation(),
      user.activeTeamId, //$1
      filters?.topicIds?.length ? filters?.topicIds?.join(',') : null, //$2
      fromDate, // $3
      toDate // $4
    )

    const topicStats = statsTopic.map((val) => ({
      name: val.name,
      totalShares: val.totalShares ?? 0,
      totalComments: val.totalComments ?? 0,
      totalLikes: val.totalLikes ?? 0,
      totalContents: val.totalContents ?? 0,
      totalInteractions: 0,
      totalAmount: 0,
      totalClients: 0
    }))

    return topicStats[0]
  } catch (e) {
    logError('getTopicsStats %o', e)

    const message = useErrorParser(e)

    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}
