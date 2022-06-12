import { useErrorParser } from '@helpers'
import { logError, logQuery } from '@helpers/logger'
import { TopicResponse, QueryGetCategoriesArgs } from '@modules-types'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'

export default async (
  _parent: unknown,
  { filters, size, skip }: QueryGetCategoriesArgs,
  { user, sentryId, prisma }: Context & Required<Context>
): Promise<TopicResponse> => {
  logQuery('getCategories %o', user)

  // User must be logged in before performing the operation.
  if (!user) throw new ApolloError('You must be logged in.', '401')

  try {
    const topicsWithTotal = await prisma.topic.count({
      where: { teamId: user.activeTeamId },
      select: { id: true }
    })

    if (!filters?.terms) {
      return {
        topics: await prisma.topic.findMany({
          where: { teamId: user.activeTeamId },
          orderBy: [
            filters?.sortBy
              ? filters.sortBy === 'name'
                ? { name: 'desc' }
                : filters.sortBy === 'createdAt'
                ? { createdAt: 'desc' }
                : { name: 'desc' }
              : { name: 'desc' }
          ],
          take: size ?? 30,
          skip: skip ?? 0
        }),
        meta: {
          total: topicsWithTotal?.id ?? 0
        }
      }
    }

    const topicsStartsWith = await prisma.topic.findMany({
      where: {
        name: { startsWith: filters.terms, mode: 'insensitive' },
        teamId: user.activeTeamId
      },
      orderBy: [
        filters?.sortBy
          ? filters.sortBy === 'name'
            ? { name: 'desc' }
            : filters.sortBy === 'createdAt'
            ? { createdAt: 'desc' }
            : { name: 'desc' }
          : { name: 'desc' }
      ],
      take: size ?? 30,
      skip: skip ?? 0
    })

    const topicsContains = await prisma.topic.findMany({
      where: {
        name: { contains: filters.terms, mode: 'insensitive' },
        teamId: user.activeTeamId
      },
      orderBy: [
        filters?.sortBy
          ? filters.sortBy === 'name'
            ? { name: 'desc' }
            : filters.sortBy === 'createdAt'
            ? { createdAt: 'desc' }
            : { name: 'desc' }
          : { name: 'desc' }
      ],
      take: size ?? 30,
      skip: skip ?? 0
    })

    return {
      meta: {
        total: topicsWithTotal.id ?? 0
      },
      topics: [...topicsStartsWith, ...topicsContains]
    }
  } catch (e) {
    logError('getCategories %o', e)

    const message = useErrorParser(e)
    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}
