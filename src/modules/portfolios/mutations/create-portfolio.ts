import { useErrorParser } from '@/helpers'
import { environment } from '@/helpers/environment'
import { logError, logMutation } from '@/helpers/logger'
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

    const { title } = input
    let description = input.description ?? undefined
    let templateId = input.templateId ?? undefined
    let clientId = input.clientId ?? undefined
    let categoryId = input.categoryId ?? undefined
    let tags = input.tags ?? undefined

    //Generate URL
    let url = `${environment.domain}/${user.username}/${String(
      Math.floor(100000 + Math.random() * 900000)
    )}`

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
      { url, description, title, templateId, clientId, categoryId, tags },
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
