import { useErrorParser } from '@/helpers'
import { getPageviews, getStats, getWebsite } from '@extensions/umami'
import { logError, logQuery } from '@helpers/logger'
import {
  InputMaybe,
  PortfolioFiltersInput,
  PortfolioStats,
  QueryGetPortfolioStatsArgs
} from '@modules-types'
import { Portfolio } from '@prisma/client'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'

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
  let totalViews: any = []

  let totalSessions: any = []

  const promises = portfolios.map(async (item) => {
    const website = await getWebsite({
      id: item.analyticsId!
    })

    const data = await getStats(
      {
        websiteUuid: item.analyticsId!
      },
      {
        ...getFilters(filters, website)
      }
    )
    // Load Page views
    const pageviews = await getPageviews(
      { websiteUuid: item.analyticsId! },
      {
        ...getFilters(filters, website)
      }
    )

    calculateData(data) // I hate this side effect function
    totalViews.push(...pageviews.pageviews)
    totalSessions.push(...pageviews.sessions)
  })
  await Promise.all(promises)

  const output = calculatePageviews(totalViews)
  const outputSessions = calculateSessions(totalSessions)

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

function calculateData(data: any) {
  totalPageViews.value += data?.pageviews?.value ?? 0
  totalPageViews.change += data?.pageviews?.change ?? 0

  totalUniques.value += data?.uniques?.value ?? 0
  totalUniques.change += data?.uniques?.change ?? 0

  totalBounces.value += data?.bounces?.value
  totalBounces.change += data?.bounces?.change
}

function getFilters(filters: PortfolioFiltersInput, website: any) {
  return {
    ...filters,
    fromDate:
      filters.period == 'all' ? new Date(website.createdAt) : filters.fromDate,
    toDate: filters.period == 'all' ? Date.now() : filters.toDate,
    unit: filters.period == 'all' ? 'hour' : filters.unit
  }
}

function calculatePageviews(totalViews: any) {
  return totalViews.reduce(function (accumulator: any, cur: any) {
    const date = cur.t,
      found = accumulator.find(function (elem: any) {
        return elem.t == date
      })
    if (found) found.y += cur.y
    else accumulator.push(cur)
    return accumulator
  }, [])
}

function calculateSessions(totalSessions: any) {
  return totalSessions.reduce(function (accumulator: any, cur: any) {
    const date = cur.t,
      found = accumulator.find(function (elem: any) {
        return elem.t == date
      })
    if (found) found.y += cur.y
    else accumulator.push(cur)
    return accumulator
  }, [])
}
