import { useErrorParser } from '@/helpers'
import { getPageviews, getStats, getWebsite } from '@extensions/umami'
import { logError, logQuery } from '@helpers/logger'
import { PortfolioStats, QueryGetPortfolioStatsArgs } from '@modules-types'
import { Portfolio } from '@prisma/client'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'

export default async (
  _parent: unknown,
  { filters }: QueryGetPortfolioStatsArgs,
  { user, sentryId, prisma }: Context & Required<Context>
): Promise<PortfolioStats> => {
  logQuery('getPortfolioStats %o', user)
  try {
    // User must be logged in before performing the operation.
    if (!user) throw new ApolloError('You must be logged in.', '401')

    if (filters?.portfolioId) {
      const portfolio = await prisma.portfolio.findUnique({
        where: { id: filters.portfolioId }
      })

      if (!portfolio) throw new ApolloError('portfolio not found')

      return resolver([portfolio], filters)
    }

    // Grab all user Analytics websites
    const portfolios = await prisma.portfolio.findMany({
      where: { userId: user.id }
    })

    return resolver(portfolios, filters)
  } catch (e) {
    logError('getPortfolioStats %o', e)

    const message = useErrorParser(e)
    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}

async function resolver(portfolios: Array<Portfolio>, filters: any) {
  let totalPageViews = {
    value: 0,
    change: 0
  }

  let totalUniques = {
    value: 0,
    change: 0
  }

  let totalBounces = {
    value: 0,
    change: 0
  }

  let totalViews: any = []

  let totalSessions: any = []

  const promises = portfolios.map(async (item) => {
    const website = await getWebsite({ id: item.analyticsId! })

    const data = await getStats(
      {
        websiteUuid: item.analyticsId!
      },
      {
        ...filters,
        fromDate:
          filters.period == 'all'
            ? new Date(website.createdAt)
            : filters.fromDate,
        toDate: filters.period == 'all' ? Date.now() : filters.toDate,
        unit: filters.period == 'all' ? 'hour' : filters.unit
      }
    )

    totalPageViews.value = totalPageViews.value += data.pageviews.value
    totalPageViews.change = totalPageViews.change += data.pageviews.change

    totalUniques.value = totalUniques.value += data.uniques.value
    totalUniques.change = totalUniques.change += data.uniques.change

    totalBounces.value = totalBounces.value += data.bounces.value
    totalBounces.change = totalBounces.change += data.bounces.change

    // Load Page views

    const pageviews = await getPageviews(
      { websiteUuid: item.analyticsId! },
      {
        ...filters,
        fromDate:
          filters.period == 'all'
            ? new Date(website.createdAt)
            : filters.fromDate,
        toDate: filters.period == 'all' ? Date.now() : filters.toDate,
        unit: filters.period == 'all' ? 'hour' : filters.unit
      }
    )
    totalViews.push(...pageviews.pageviews)
    totalSessions.push(...pageviews.sessions)
  })
  await Promise.all(promises)

  const output = totalViews.reduce(function (accumulator: any, cur: any) {
    const date = cur.t,
      found = accumulator.find(function (elem: any) {
        return elem.t == date
      })
    if (found) found.y += cur.y
    else accumulator.push(cur)
    return accumulator
  }, [])

  const outputSessions = totalSessions.reduce(function (
    accumulator: any,
    cur: any
  ) {
    const date = cur.t,
      found = accumulator.find(function (elem: any) {
        return elem.t == date
      })
    if (found) found.y += cur.y
    else accumulator.push(cur)
    return accumulator
  },
  [])

  return {
    stats: {
      totalPageViews,
      totalUniques,
      totalBounces,
      totalUsers: {
        value: totalBounces.value + totalUniques.value,
        change: totalBounces.change + totalUniques.change
      }
    },

    analytics: {
      pageviews: output,
      sessions: outputSessions
    }
  }
}
