import { useErrorParser } from '@helpers'
import { logError, logQuery } from '@helpers/logger'
import { PortfolioResponse, QueryGetPortfoliosArgs } from '@modules-types'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'
import wherePortfolios from '../helpers/where-portfolios'

export default async (
  _parent: unknown,
  { size, skip, filters }: QueryGetPortfoliosArgs,
  { user, sentryId, prisma }: Context & Required<Context>
): Promise<PortfolioResponse> => {
  logQuery('getPortfolios %o', user)
  try {
    if (!user) throw new ApolloError('You must be logged in.', '401')

    const where = wherePortfolios(user, filters)

    const portfolioWithTotal = await prisma.portfolio.count({
      where,
      select: { id: true }
    })

    const portfolioWithNetTotal = await prisma.portfolio.count({
      where: { userId: user.id },
      select: { id: true }
    })

    const portfolios = await prisma.portfolio.findMany({
      orderBy: [{ title: 'desc' }],
      where,
      take: size ?? undefined,
      skip: skip ?? 0
    })

    return {
      meta: {
        total: portfolioWithTotal.id ?? 0,
        netTotal: portfolioWithNetTotal?.id ?? 0
      },
      portfolios
    }
  } catch (e) {
    logError('getPortfolios %o', e)

    const message = useErrorParser(e)
    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}
