import { useErrorParser } from '@/helpers'
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
  const { user, ipAddress, requestURL, sentryId } = context
  logMutation('createPortfolio %o', {
    input,
    user,
    ipAddress,
    requestURL
  })
  try {
    if (!user) throw new ApolloError('You must be logged in.', '401')

    const { url, title } = input
    let description = input.description ?? undefined
    let templateId = input.templateId ?? undefined
    return createPortfolio({ url, description, title, templateId }, context)
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
