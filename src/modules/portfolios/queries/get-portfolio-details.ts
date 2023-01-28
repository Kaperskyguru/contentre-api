import { useErrorParser } from '@helpers'
import { logError, logQuery } from '@helpers/logger'
import { PortfolioDetail, QueryGetPortfolioDetailArgs } from '@modules-types'
import { prisma as prismaClient } from '@/config'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'

export default async (
  _parent: unknown,
  { filters }: QueryGetPortfolioDetailArgs,
  { sentryId }: Context & Required<Context>
): Promise<PortfolioDetail> => {
  logQuery('getPortfolioDetail %o', filters)
  try {
    if (!filters.domain && !filters?.url) {
      throw new ApolloError('URL not found', '404')
    }

    // Select user details

    if (filters.isCustomDomain && filters.domain) {
      const formattedURL = filters.domain.replace(/\/$/, '').trim()

      const portfolio = await getPortfolioFromCustomDomain(formattedURL)

      if (!portfolio) throw new ApolloError('Portfolio not found', '404')

      const user = await getUserFromID(portfolio.userId)

      return await resolver(user, portfolio)
    }

    if (!filters.url) throw new ApolloError('URL not found', '404')

    const formattedURL = filters.url.replace(/\/$/, '').trim()

    const user = await getUserFromUsername(filters.username!)

    if (!user) throw new ApolloError('User not found', '404')

    const portfolio = await getPortfolioFromUserIdAndURL(user.id, formattedURL)

    if (!portfolio) throw new ApolloError('Portfolio not found', '404')

    // Resolve and return
    return await resolver(user, portfolio)
  } catch (e) {
    logError('getPortfolioDetail %o', e)

    const message = useErrorParser(e)
    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}

async function getPortfolioFromCustomDomain(domain: string) {
  return await prismaClient.portfolio.findFirst({
    where: { domain: { equals: domain, mode: 'insensitive' } },
    include: { userTemplate: { include: { template: true } } }
  })
}

async function getUserFromUsername(username: string) {
  return await prismaClient.user.findFirst({
    where: { username: { equals: username, mode: 'insensitive' } }
  })
}

async function getUserFromID(id: string) {
  return await prismaClient.user.findFirst({
    where: { id }
  })
}

async function getPortfolioFromUserIdAndURL(id: string, url: string) {
  return await prismaClient.portfolio.findFirst({
    where: { userId: id, url: { equals: url, mode: 'insensitive' } },
    include: { userTemplate: { include: { template: true } } }
  })
}

async function resolver(user: any, portfolio: any) {
  const socials = await prismaClient.social.findMany({
    where: { userId: user.id }
  })

  const template = portfolio?.userTemplate?.template!
  return {
    html: portfolio?.userTemplate?.content,
    analyticsId: portfolio.analyticsId,
    css: portfolio?.userTemplate?.css,
    templateType: template?.type,
    templateSlug: template?.slug,
    about: user.bio,
    job: user.jobTitle,
    coverImage: '',
    profileImage: user.avatarURL,
    name: user.name,
    socials,
    contact: {
      email: user.email,
      phone: user.phoneNumber,
      address: user.homeAddress
    }
  }
}
