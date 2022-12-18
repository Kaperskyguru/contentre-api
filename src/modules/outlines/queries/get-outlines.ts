import { useErrorParser } from '@helpers'
import { logError, logQuery } from '@helpers/logger'
import { QueryGetOutlinesArgs, OutlineResponse } from '@modules-types'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'
import whereOutlines from '../helpers/where-outlines'

export default async (
  _parent: unknown,
  { filters, size, skip }: QueryGetOutlinesArgs,
  { user, sentryId, prisma }: Context & Required<Context>
): Promise<OutlineResponse> => {
  logQuery('getOutlines %o', user)

  // User must be logged in before performing the operation.
  if (!user) throw new ApolloError('You must be logged in.', '401')

  try {
    const where = whereOutlines(user, filters)
    const outlineWithTotal = await prisma.content.count({
      where: { ...where },
      select: { id: true }
    })
    if (!filters?.terms) {
      return {
        outlines: await prisma.content.findMany({
          where: { ...where },
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
          total: outlineWithTotal.id ?? 0
        }
      }
    }

    const outlinesStartsWith = await prisma.content.findMany({
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

    const outlinesContains = await prisma.content.findMany({
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
        total: outlineWithTotal.id ?? 0
      },
      outlines: [...outlinesStartsWith, ...outlinesContains]
    }
  } catch (e) {
    logError('getOutlines %o', e)

    const message = useErrorParser(e)
    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}
