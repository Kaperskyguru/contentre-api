import { useErrorParser } from '@helpers'
import { logError, logQuery } from '@helpers/logger'
import { QueryGetNotebooksArgs, NotebookResponse } from '@modules-types'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'

export default async (
  _parent: unknown,
  { filters, size, skip }: QueryGetNotebooksArgs,
  { user, sentryId, prisma }: Context & Required<Context>
): Promise<NotebookResponse> => {
  logQuery('getNotebooks %o', user)

  // User must be logged in before performing the operation.
  if (!user) throw new ApolloError('You must be logged in.', '401')

  try {
    const where: any = {}
    where.userId = user.id
    where.teamId = user.activeTeamId

    const notebookWithTotal = await prisma.notebook.count({
      where,
      select: { id: true }
    })
    if (!filters?.terms) {
      return {
        notebooks: await prisma.notebook.findMany({
          where: { ...where },
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
          total: notebookWithTotal.id ?? 0
        }
      }
    }

    const notebooksStartsWith = await prisma.notebook.findMany({
      where: {
        name: { startsWith: filters.terms, mode: 'insensitive' },
        ...where
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

    const notebooksContains = await prisma.notebook.findMany({
      where: {
        name: { contains: filters.terms, mode: 'insensitive' },
        ...where
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
        total: notebookWithTotal.id ?? 0
      },
      notebooks: [...notebooksStartsWith, ...notebooksContains]
    }
  } catch (e) {
    logError('getNotebooks %o', e)

    const message = useErrorParser(e)
    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}
