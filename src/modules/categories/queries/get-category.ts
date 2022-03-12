import { useErrorParser } from '@/helpers'
import { logError, logQuery } from '@helpers/logger'
import { Category, QueryGetCategoryArgs } from '@modules-types'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'

export default async (
  _parent: unknown,
  { id }: QueryGetCategoryArgs,
  { user, sentryId, prisma }: Context & Required<Context>
): Promise<Category> => {
  logQuery('getCategory %o', user)
  try {
    // User must be logged in before performing the operation.
    if (!user) throw new ApolloError('You must be logged in.', '401')

    // Grab the desired row by its compound primary key.
    const category = await prisma.category.findUnique({
      where: { id: id }
    })

    if (!category) throw new ApolloError('category not found')
    return category
  } catch (e) {
    logError('getCategory %o', e)

    const message = useErrorParser(e)
    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}
