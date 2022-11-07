import { useErrorParser } from '@/helpers'
import { environment } from '@/helpers/environment'
import { logError, logMutation } from '@/helpers/logger'
import totalPortfolios from '@/modules/users/fields/total-portfolios'
import { Context } from '@/types'
import { Portfolio, MutationCreatePortfolioArgs } from '@/types/modules'
import { ApolloError } from 'apollo-server-core'
import { createPortfolio } from '../helpers/create-portfolio'

export default async (
  _parent: unknown,
  { input }: MutationCreatePortfolioArgs,
  context: Context & Required<Context>
): Promise<Portfolio> => {
  const { user, ipAddress, requestURL, sentryId, prisma } = context
  logMutation('createPortfolio %o', {
    input,
    user,
    ipAddress,
    requestURL
  })
  try {
    if (!user) throw new ApolloError('You must be logged in.', '401')

    // Check if portfolio exceeded
    const totalPortfolio = await totalPortfolios(user)
    if (!user.isPremium && (totalPortfolio ?? 0) >= 2)
      throw new ApolloError('You have exceeded your portfolio limit.', '401')

    if (!user.isPremium && input.googleAnalyticId)
      throw new ApolloError('Google Analytic is a premium', '401')

    if (!user.isPremium && input.domain)
      throw new ApolloError('Custom Domain is a premium', '401')

    if (!user.isPremium && input.password)
      throw new ApolloError('Password Protection is a premium', '401')

    const { title } = input
    let description = input.description ?? undefined
    let templateId = input.templateId ?? undefined
    let clientId = input.clientId ?? undefined
    let categoryId = input.categoryId ?? undefined
    let tags = input.tags ?? undefined
    let googleAnalyticId = input.googleAnalyticId ?? undefined
    let password = input.password ?? undefined
    let domain = input.domain ?? undefined
    let shouldCustomize = input.shouldCustomize ?? false
    let topics = input.topics ?? undefined

    const countPortfolio = await prisma.portfolio.count({
      where: { userId: user.id }
    })

    let url = `${environment.domain}/${user.username}`
    if (countPortfolio < 1) {
      return createPortfolio(
        {
          url,
          description,
          title,
          templateId,
          clientId,
          topics,
          categoryId,
          tags,
          googleAnalyticId,
          domain,
          password,
          shouldCustomize
        },
        { user, prisma }
      )
    }

    //Generate URL
    url = `${environment.domain}/${user.username}/${String(
      Math.floor(100000 + Math.random() * 900000)
    )}`

    /**
     *
     * When creating Templates, Generate Slug in this format
     *
     * Name: Light Green
     *
     * Slug: LightGreen_[rand]
     *
     */

    //Check for existing portfolio
    const portfolio = await prisma.portfolio.findFirst({
      where: { userId: user.id, url: url }
    })

    if (portfolio) {
      url = `${environment.domain}/${user.username}/${String(
        Math.floor(100000 + Math.random() * 900000)
      )}`
    }

    return createPortfolio(
      {
        url,
        description,
        title,
        templateId,
        clientId,
        isPremium: user.isPremium,
        categoryId,
        tags,
        topics,
        googleAnalyticId,
        domain,
        password,
        shouldCustomize
      },
      { user, prisma }
    )
  } catch (e) {
    logError('createPortfolio %o', {
      input,
      user,
      ipAddress,
      requestURL,
      error: e
    })

    const message = useErrorParser(e)

    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}
