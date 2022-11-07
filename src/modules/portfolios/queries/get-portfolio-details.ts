import { useErrorParser } from '@helpers'
import { logError, logQuery } from '@helpers/logger'
import { PortfolioDetail, QueryGetPortfolioDetailArgs } from '@modules-types'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'

export default async (
  _parent: unknown,
  { filters }: QueryGetPortfolioDetailArgs,
  { sentryId, prisma }: Context & Required<Context>
): Promise<PortfolioDetail> => {
  logQuery('getPortfolioDetail %o', filters)
  try {
    const user = await prisma.user.findFirst({
      where: { username: { equals: filters.username, mode: 'insensitive' } }
    })

    if (!user) {
      throw new ApolloError('User not found', '404')
    }

    if (!filters?.url) {
      throw new ApolloError('URL not found', '404')
    }
    const formattedURL = filters?.url.replace(/\/$/, '').trim()

    const portfolio = await prisma.portfolio.findFirst({
      where: {
        userId: user.id,
        url: { equals: formattedURL, mode: 'insensitive' }
      },
      include: { userTemplate: { include: { template: true } } }
    })

    if (!portfolio) {
      throw new ApolloError('Portfolio not found', '404')
    }

    const socials = await prisma.social.findMany({
      where: { userId: user.id }
    })

    const template = portfolio?.userTemplate.template
    return {
      html: portfolio?.userTemplate?.content,
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
  } catch (e) {
    logError('getPortfolioDetail %o', e)

    const message = useErrorParser(e)
    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}
