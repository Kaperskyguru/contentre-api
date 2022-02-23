import { useErrorParser } from '@/helpers'
import { logError, logMutation } from '@/helpers/logger'
import { Context } from '@/types'
import { MutationDeletePortfolioArgs } from '@/types/modules'
import { ApolloError } from 'apollo-server-core'

export default async (
  _parent: unknown,
  { id }: MutationDeletePortfolioArgs,
  context: Context & Required<Context>
): Promise<boolean> => {
  const { prisma, user } = context
  logMutation('deletePortfolio %o', user)
  try {
    // User must be logged in before performing the operation.
    if (!user) throw new ApolloError('You must be logged in.', '401')

    // Check for required arguments not provided.
    if (!id) {
      throw new ApolloError('Invalid input', '422')
    }

    const portfolio = await prisma.portfolio.findUnique({
      where: { id }
    })

    if (!portfolio) {
      throw new ApolloError('portfolio not found', '404')
    }

    // Check if the user is authorized to delete the portfolio.
    if (portfolio.userId !== user.id) {
      throw new Error('unauthorized')
    }

    const deleteTemplate = prisma.portfolio.delete({
      where: { id: portfolio.templateId }
    })

    const deletePortfolio = prisma.portfolio.delete({
      where: { id }
    })

    const [deletedPortfolio] = await prisma.$transaction([
      deleteTemplate,
      deletePortfolio
    ])

    return !!deletedPortfolio
  } catch (e) {
    logError('createPortfolio %o', user)

    const message = useErrorParser(e)

    throw new ApolloError(message, e.code ?? '500', {})
  }
}
