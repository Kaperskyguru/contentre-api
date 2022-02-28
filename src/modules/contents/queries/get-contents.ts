import { useErrorParser } from '@helpers'
import { logError, logQuery } from '@helpers/logger'
import { Content, QueryGetContentsArgs } from '@modules-types'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'
import whereContents from '../helpers/where-contents'

export default async (
  _parent: unknown,
  { size, skip, filters }: QueryGetContentsArgs,
  { user, sentryId, prisma }: Context & Required<Context>
): Promise<Content[]> => {
  logQuery('getContents %o', user)
  try {
    if (!user) throw new ApolloError('You must be logged in.', '401')

    const where = whereContents(user, filters)

    const contents = await prisma.content.findMany({
      orderBy: [
        filters?.sortBy
          ? filters.sortBy === 'title'
            ? { title: 'desc' }
            : filters.sortBy === 'lastUpdated'
            ? { lastUpdated: 'desc' }
            : filters.sortBy === 'visibility'
            ? { visibility: 'desc' }
            : filters.sortBy === 'amount'
            ? { amount: 'desc' }
            : filters.sortBy === 'client'
            ? {
                client: {
                  name: 'desc'
                }
              }
            : filters.sortBy === 'category'
            ? {
                category: {
                  name: 'desc'
                }
              }
            : { title: 'desc' }
          : { title: 'desc' }
      ],
      where,
      include: { client: true, category: true },
      take: size ?? undefined,
      skip: skip ?? 0
    })
    return contents
  } catch (e) {
    logError('getContents %o', e)

    const message = useErrorParser(e)
    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}
