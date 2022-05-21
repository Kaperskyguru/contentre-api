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
      where: { username: filters.username }
    })

    if (!user) {
      throw new ApolloError('User not found', '404')
    }

    // Remove www from URL and / at the end

    const portfolio = await prisma.portfolio.findFirst({
      where: { userId: user.id, url: filters?.url! },
      include: { template: { include: { template: true } } }
    })

    if (!portfolio) {
      throw new ApolloError('Portfolio not found', '404')
    }

    const template = portfolio?.template.template
    return {
      html: portfolio?.template?.content,
      templateType: template?.type,
      templateSlug: template?.slug,
      about: user.bio,
      job: user.jobTitle,
      coverImage: '',
      profileImage: user.avatarURL,
      name: user.name
    }
  } catch (e) {
    logError('getPortfolioDetail %o', e)

    const message = useErrorParser(e)
    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}
