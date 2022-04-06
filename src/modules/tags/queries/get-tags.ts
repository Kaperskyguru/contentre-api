import { useErrorParser } from '@helpers'
import { logError, logQuery } from '@helpers/logger'
import { QueryGetTagsArgs, Tag } from '@modules-types'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'

export default async (
  _parent: unknown,
  { filters, size, skip }: QueryGetTagsArgs,
  { user, sentryId, prisma }: Context & Required<Context>
): Promise<Tag[]> => {
  logQuery('getTags %o', user)

  // User must be logged in before performing the operation.
  if (!user) throw new ApolloError('You must be logged in.', '401')

  try {
    const where: any = {}
    if (!filters?.all) {
      where.userId = user.id
    }
    if (!filters?.terms) {
      return await prisma.tag.findMany({
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
        take: 10
      })
    }

    const tagsStartsWith = await prisma.tag.findMany({
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
      take: 10
    })

    const tagsContains = await prisma.tag.findMany({
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
      take: 5
    })

    return [...tagsStartsWith, ...tagsContains]
  } catch (e) {
    logError('getTags %o', e)

    const message = useErrorParser(e)
    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}
