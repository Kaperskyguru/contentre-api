import { useErrorParser } from '@helpers'
import { logError, logQuery } from '@helpers/logger'
import {
  AllPortfoliosResponse,
  QueryGetAllPortfoliosArgs
} from '@modules-types'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'
import whereAllPortfolios from '../helpers/whereAllPortfolios'

export default async (
  _parent: unknown,
  { size, skip, filters }: QueryGetAllPortfoliosArgs,
  { user, sentryId, prisma }: Context & Required<Context>
): Promise<AllPortfoliosResponse> => {
  logQuery('getAllPortfolios %o', user)
  try {
    const where = whereAllPortfolios(filters)

    const portfolioWithTotal = await prisma.portfolio.count({
      where,
      select: { id: true }
    })

    const userWithTotal = await prisma.user.count({
      select: { id: true }
    })

    const portfolios = await prisma.portfolio.findMany({
      orderBy: [{ user: { isPremium: 'desc' } }],
      where,
      include: { user: true },
      take: size ?? undefined,
      skip: skip ?? 0
    })

    return {
      meta: {
        totalUsers: userWithTotal?.id ?? 0,
        total: portfolioWithTotal.id ?? 0
      },
      portfolios
    }
  } catch (e) {
    logError('getAllPortfolios %o', e)
    const message = useErrorParser(e)
    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}
