import { useErrorParser } from '@/helpers'
import { logError, logQuery } from '@helpers/logger'
import { Portfolio, QueryGetPortfolioArgs } from '@modules-types'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'

export default async (
  _parent: unknown,
  { id }: QueryGetPortfolioArgs,
  { user, sentryId, prisma }: Context & Required<Context>
): Promise<Portfolio> => {
  logQuery('getPortfolio %o', user)
  try {
    // User must be logged in before performing the operation.
    if (!user) throw new ApolloError('You must be logged in.', '401')

    // Grab the desired row by its compound primary key.
    const portfolio = await prisma.portfolio.findUnique({
      where: { id: id },
      include: { template: { include: { template: true } } }
    })

    if (!portfolio) throw new ApolloError('portfolio not found')
    return portfolio
  } catch (e) {
    logError('getPortfolio %o', e)

    const message = useErrorParser(e)
    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}
