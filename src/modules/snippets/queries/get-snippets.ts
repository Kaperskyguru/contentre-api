import { useErrorParser } from '@helpers'
import { logError, logQuery } from '@helpers/logger'
import { QueryGetSnippetsArgs, SnippetResponse } from '@modules-types'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'
import whereSnippets from '../helpers/where-snippets'

export default async (
  _parent: unknown,
  { filters, size, skip }: QueryGetSnippetsArgs,
  { user, sentryId, prisma }: Context & Required<Context>
): Promise<SnippetResponse> => {
  logQuery('getSnippets %o', user)

  // User must be logged in before performing the operation.
  if (!user) throw new ApolloError('You must be logged in.', '401')

  try {
    const where = whereSnippets(user, filters)
    const snippetWithTotal = await prisma.content.count({
      where,
      select: { id: true }
    })
    if (!filters?.terms) {
      return {
        snippets: await prisma.content.findMany({
          where,
          orderBy: [
            filters?.sortBy
              ? filters.sortBy === 'title'
                ? { title: 'desc' }
                : filters.sortBy === 'createdAt'
                ? { createdAt: 'desc' }
                : { title: 'desc' }
              : { title: 'desc' }
          ],
          take: size ?? 30,
          skip: skip ?? 0
        }),

        meta: {
          total: snippetWithTotal.id ?? 0
        }
      }
    }

    const snippetsStartsWith = await prisma.content.findMany({
      where: {
        title: { startsWith: filters.terms, mode: 'insensitive' },
        ...where
      },
      orderBy: [
        filters?.sortBy
          ? filters.sortBy === 'title'
            ? { title: 'desc' }
            : filters.sortBy === 'createdAt'
            ? { createdAt: 'desc' }
            : { title: 'desc' }
          : { title: 'desc' }
      ],
      take: size ?? 30,
      skip: skip ?? 0
    })

    const snippetsContains = await prisma.content.findMany({
      where: {
        title: { contains: filters.terms, mode: 'insensitive' },
        ...where
      },
      orderBy: [
        filters?.sortBy
          ? filters.sortBy === 'title'
            ? { title: 'desc' }
            : filters.sortBy === 'createdAt'
            ? { createdAt: 'desc' }
            : { title: 'desc' }
          : { title: 'desc' }
      ],
      take: size ?? 30,
      skip: skip ?? 0
    })

    return {
      meta: {
        total: snippetWithTotal.id ?? 0
      },
      snippets: [...snippetsStartsWith, ...snippetsContains]
    }
  } catch (e) {
    logError('getSnippets %o', e)

    const message = useErrorParser(e)
    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}
