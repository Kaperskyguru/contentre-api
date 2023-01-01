import Medium from '@extensions/medium'
import { useErrorParser } from '@helpers'
import { logError, logQuery } from '@helpers/logger'
import { ContentResponse, QueryGetContentsArgs } from '@modules-types'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'
import whereContents from '../helpers/where-contents'

export default async (
  _parent: unknown,
  { size, skip, filters }: QueryGetContentsArgs,
  { user, sentryId, prisma }: Context & Required<Context>
): Promise<ContentResponse> => {
  logQuery('getContents %o', user)
  try {
    if (!user) throw new ApolloError('You must be logged in.', '401')

    const where = whereContents(user, filters)

    const contentWithTotal = await prisma.content.count({
      where,
      select: { id: true }
    })

    const contentWithNetTotal = await prisma.content.count({
      where: {
        userId: user.id,
        notebookId: null,
        class: 'ARTICLE'
      },
      select: { id: true }
    })

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
    return {
      meta: {
        total: contentWithTotal.id ?? 0,
        netTotal: contentWithNetTotal?.id ?? 0
      },
      contents
    }
  } catch (e) {
    logError('getContents %o', e)

    const message = useErrorParser(e)
    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}
