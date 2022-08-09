import { useErrorParser } from '@helpers'
import { logError, logQuery } from '@helpers/logger'
import { QueryGetIndexMetadataArgs, OverallStatResponse } from '@modules-types'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'
import whereContents from '@/modules/contents/helpers/where-contents'

export default async (
  _parent: unknown,
  { filters }: QueryGetIndexMetadataArgs,
  { user, sentryId, prisma }: Context & Required<Context>
): Promise<OverallStatResponse> => {
  logQuery('getTopicStats %o', user)
  try {
    if (!user) throw new ApolloError('You must be logged in.', '401')

    type TopicStat = {
      name: string
      totalContents: number
      totalLikes: number
      totalComments: number
      totalShares: number

      totalAmount: number
      totalInteractions: number
      totalClients: number
    }

    const where = whereContents(user, filters)
    const topics = await prisma.content.aggregate({
      where,
      _sum: {
        likes: true,
        comments: true,
        shares: true,
        amount: true
      },

      _count: {
        id: true,
        clientId: true
      }
    })

    const statsTopic = topics?._sum ?? {}

    const TopicStats: TopicStat = {
      name: filters?.topics?.length
        ? filters?.topics.join(',')
        : 'Topic Overview',
      totalShares: statsTopic?.shares ?? 0,
      totalComments: statsTopic?.comments ?? 0,
      totalLikes: statsTopic?.likes ?? 0,

      totalInteractions:
        (statsTopic?.shares ?? 0) +
        (statsTopic?.comments ?? 0) +
        (statsTopic?.likes ?? 0),
      totalContents: topics?._count?.id ?? 0,
      totalAmount: topics?._sum?.amount ?? 0.0,
      totalClients: topics?._count?.clientId ?? 0
    }

    return TopicStats
  } catch (e) {
    logError('getTopicStats %o', e)

    const message = useErrorParser(e)

    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}
