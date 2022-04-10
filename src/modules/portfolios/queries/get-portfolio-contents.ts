import { useErrorParser } from '@helpers'
import { logError, logQuery } from '@helpers/logger'
import { PortfolioContent, QueryGetPortfolioContentArgs } from '@modules-types'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'

export default async (
  _parent: unknown,
  { size, skip, filters }: QueryGetPortfolioContentArgs,
  { sentryId, prisma }: Context & Required<Context>
): Promise<PortfolioContent> => {
  logQuery('getPortfolioContent %o', filters)
  try {
    // Select user details

    const user = await prisma.user.findFirst({
      where: { username: filters.username }
    })

    if (!user) {
      throw new ApolloError('User not found', '404')
    }

    const portfolio = await prisma.portfolio.findFirst({
      where: { userId: user.id, url: filters?.url! },
      include: { template: true }
    })

    // Select Contents
    const contents = await prisma.content.findMany({
      where: { userId: user?.id }
    })

    return {
      html: portfolio?.template?.content,
      about: user.bio,
      coverImage: '',
      profileImage: user.avatarURL,
      name: user.name,
      portfolios: contents
    }
  } catch (e) {
    logError('getPortfolioContent %o', e)

    const message = useErrorParser(e)
    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}
