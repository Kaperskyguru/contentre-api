import { useErrorParser } from '@helpers'
import { logError, logQuery } from '@helpers/logger'
import { Category, QueryGetCategoriesArgs } from '@modules-types'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'

export default async (
  _parent: unknown,
  { filters, size, skip }: QueryGetCategoriesArgs,
  { user, sentryId, prisma }: Context & Required<Context>
): Promise<Category[]> => {
  logQuery('getCategories %o', user)

  // User must be logged in before performing the operation.
  if (!user) throw new ApolloError('You must be logged in.', '401')

  try {
    if (!filters?.terms) {
      return await prisma.category.findMany({
        where: { userId: user.id },
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

    const categoriesStartsWith = await prisma.category.findMany({
      where: {
        name: { startsWith: filters.terms, mode: 'insensitive' },
        userId: user.id
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

    const categoriesContains = await prisma.category.findMany({
      where: {
        name: { contains: filters.terms, mode: 'insensitive' },
        userId: user.id
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

    return [...categoriesStartsWith, ...categoriesContains]
  } catch (e) {
    logError('getCategories %o', e)

    const message = useErrorParser(e)
    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}
