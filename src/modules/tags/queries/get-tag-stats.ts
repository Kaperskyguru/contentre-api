import { useErrorParser } from '@helpers'
import { logError, logQuery } from '@helpers/logger'
import { QueryGetIndexMetadataArgs, OverallStatResponse } from '@modules-types'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'

import getDateIntervals from '@/helpers/get-date-intervals'

export default async (
  _parent: unknown,
  { filters }: QueryGetIndexMetadataArgs,
  { user, sentryId, prisma }: Context & Required<Context>
): Promise<OverallStatResponse> => {
  logQuery('getTagStats %o', user)
  try {
    if (!user) throw new ApolloError('You must be logged in.', '401')

    const { toDate, fromDate } = getDateIntervals(filters)

    type TagStat = {
      name: string
      totalContents: number
      totalLikes: number
      totalComments: number
      totalShares: number
    }

    const tags = await prisma.content.aggregate({
      where: {
        userId: user.id,
        tags: {
          path: [],
          array_contains: filters?.tags?.length ? filters?.tags : null
        },
        createdAt: {
          gte: fromDate,
          lt: toDate
        }
      },
      _sum: {
        likes: true,
        comments: true,
        shares: true
      },
      _count: {
        id: true
      }
    })

    const statsTag = tags?._sum ?? {}

    const tagStats: TagStat = {
      name: filters?.tags?.length ? filters?.tags.join(',') : '',
      totalShares: statsTag?.shares ?? 0,
      totalComments: statsTag?.comments ?? 0,
      totalLikes: statsTag?.likes ?? 0,
      totalContents: tags?._count?.id ?? 0
    }

    return tagStats
  } catch (e) {
    logError('getTagStats %o', e)

    const message = useErrorParser(e)

    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}
