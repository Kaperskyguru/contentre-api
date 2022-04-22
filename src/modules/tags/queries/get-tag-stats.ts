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
  logQuery('getTagStats %o', user)
  try {
    if (!user) throw new ApolloError('You must be logged in.', '401')

    type TagStat = {
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
    const tags = await prisma.content.aggregate({
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

    const statsTag = tags?._sum ?? {}

    const tagStats: TagStat = {
      name: filters?.tags?.length ? filters?.tags.join(',') : 'Tag Overview',
      totalShares: statsTag?.shares ?? 0,
      totalComments: statsTag?.comments ?? 0,
      totalLikes: statsTag?.likes ?? 0,

      totalInteractions:
        (statsTag?.shares ?? 0) +
        (statsTag?.comments ?? 0) +
        (statsTag?.likes ?? 0),
      totalContents: tags?._count?.id ?? 0,
      totalAmount: tags?._sum?.amount ?? 0.0,
      totalClients: tags?._count?.clientId ?? 0
    }

    return tagStats
  } catch (e) {
    logError('getTagStats %o', e)

    const message = useErrorParser(e)

    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}
