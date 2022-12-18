import { useErrorParser } from '@helpers'
import { logError, logQuery } from '@helpers/logger'
import { QueryGetBriefsArgs, BriefResponse } from '@modules-types'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'
import whereBriefs from '../helpers/where-briefs'

export default async (
  _parent: unknown,
  { filters, size, skip }: QueryGetBriefsArgs,
  { user, sentryId, prisma }: Context & Required<Context>
): Promise<BriefResponse> => {
  logQuery('getBriefs %o', user)

  // User must be logged in before performing the operation.
  if (!user) throw new ApolloError('You must be logged in.', '401')

  try {
    const where = whereBriefs(user, filters)
    const briefWithTotal = await prisma.content.count({
      where: { ...where },
      select: { id: true }
    })
    if (!filters?.terms) {
      return {
        briefs: await prisma.content.findMany({
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
          total: briefWithTotal.id ?? 0
        }
      }
    }

    const briefsStartsWith = await prisma.content.findMany({
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

    const briefsContains = await prisma.content.findMany({
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
        total: briefWithTotal.id ?? 0
      },
      briefs: [...briefsStartsWith, ...briefsContains]
    }
  } catch (e) {
    logError('getBriefs %o', e)

    const message = useErrorParser(e)
    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}
