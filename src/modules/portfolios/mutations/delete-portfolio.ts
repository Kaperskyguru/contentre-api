import { useErrorParser } from '@/helpers'
import { logError, logMutation } from '@/helpers/logger'
import { Context } from '@/types'
import { MutationDeletePortfolioArgs } from '@/types/modules'
import { ApolloError } from 'apollo-server-core'
import sendToSegment from '@extensions/segment-service/segment'

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

    const portfolio = await prisma.portfolio.findFirst({
      where: { id, userId: user.id }
    })

    if (!portfolio) {
      throw new ApolloError('portfolio not found', '404')
    }

    // Check if the user is authorized to delete the portfolio.
    if (portfolio.userId !== user.id) {
      throw new Error('unauthorized')
    }

    const deleteTemplate = prisma.userTemplate.delete({
      where: { id: portfolio.templateId }
    })

    const deletePortfolio = prisma.portfolio.delete({
      where: { id }
    })

    const [deleteTemplateResult, deletePortfolioResult, countPortfolios] =
      await prisma.$transaction([
        deleteTemplate,
        deletePortfolio,
        prisma.portfolio.count({
          where: { userId: user.id }
        })
      ])

    await sendToSegment({
      operation: 'identify',
      userId: user.id,
      data: {
        email: user.email
      }
    })

    await sendToSegment({
      operation: 'track',
      eventName: 'delete_portfolio',
      userId: user.id,
      data: {
        portfolioId: portfolio.id,
        portfolioURL: portfolio.url,
        userTemplateDeleted: !!deleteTemplateResult,
        portfolioCount: countPortfolios
      }
    })

    return !!deletePortfolioResult
  } catch (e) {
    logError('createPortfolio %o', user)

    const message = useErrorParser(e)

    throw new ApolloError(message, e.code ?? '500', {})
  }
}
