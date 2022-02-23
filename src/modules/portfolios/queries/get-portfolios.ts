import { useErrorParser } from '@helpers'
import { logError, logQuery } from '@helpers/logger'
import { Portfolio, QueryGetPortfoliosArgs } from '@modules-types'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'
import wherePortfolios from '../helpers/where-portfolios'

export default async (
  _parent: unknown,
  { size, skip, filters }: QueryGetPortfoliosArgs,
  { user, sentryId, prisma }: Context & Required<Context>
): Promise<Portfolio[]> => {
  logQuery('getPortfolios %o', user)
  try {
    if (!user) throw new ApolloError('You must be logged in.', '401')

    const where = wherePortfolios(user, filters)

    const portfolios = await prisma.portfolio.findMany({
      orderBy: [{ title: 'desc' }],
      where,
      take: size ?? undefined,
      skip: skip ?? 0
    })

    return portfolios
  } catch (e) {
    logError('getPortfolios %o', e)

    const message = useErrorParser(e)
    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}
