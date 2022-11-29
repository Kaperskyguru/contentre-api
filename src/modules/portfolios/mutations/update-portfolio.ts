import totalPortfolios from '@/modules/users/fields/total-portfolios'
import { previsionCustomDomain } from '@extensions/cloudflare'
import { useErrorParser } from '@helpers'
import { logError, logMutation } from '@helpers/logger'
import { MutationUpdatePortfolioArgs, Portfolio } from '@modules-types'
import { Context } from '@types'
import { ApolloError } from 'apollo-server-errors'

export default async (
  _parent: unknown,
  { id, input }: MutationUpdatePortfolioArgs,
  { user, sentryId, prisma, ipAddress, requestURL }: Context & Required<Context>
): Promise<Portfolio> => {
  logMutation('updatePortfolio %o', {
    input,
    user,
    ipAddress,
    requestURL
  })

  try {
    // User must be logged in before performing the operation.
    if (!user) throw new ApolloError('You must be logged in.', '401')

    // Check if portfolio exceeded
    const totalPortfolio = await totalPortfolios(user)
    if (!user.isPremium && (totalPortfolio ?? 0) >= 2)
      throw new ApolloError('You have exceeded your portfolio limit.', '401')

    if (!user.isPremium && input.googleAnalyticId)
      throw new ApolloError('Google Analytic is a premium', '401')

    if (!user.isPremium && input.password)
      throw new ApolloError('Password Protection is a premium', '401')

    if (!user.isPremium && input.customDomain)
      throw new ApolloError('Custom Domain is a premium', '401')

    // Extract fields from the mutation input.
    const { title, description, shouldCustomize, templateId } = input

    // Check for required arguments not provided.
    if (!id) {
      throw new ApolloError('Invalid input', '422')
    }

    let template

    if (shouldCustomize) {
      template = await prisma.template.findFirst({
        where: { title: { equals: 'CUSTOMIZE', mode: 'insensitive' } }
      })
    } else {
      if (templateId !== undefined) {
        template = await prisma.template.findUnique({
          where: { id: templateId! }
        })
      } else
        template = await prisma.template.findFirst({
          where: { title: { equals: 'BLANK', mode: 'insensitive' } }
        })
    }
    // Create UserTemplate incase of editing
    const userTemplate = await prisma.userTemplate.create({
      data: {
        template: { connect: { id: template?.id } },
        content: template?.content!
      }
    })

    const data: Record<string, unknown> = {}
    if (title !== undefined) data.title = title
    if (description !== undefined) data.description = description
    if (templateId !== undefined) data.templateId = templateId
    if (input.tags !== undefined) data.tags = input.tags
    if (input.topics !== undefined) data.topics = input.topics
    if (input.clientId !== undefined)
      data.client = { connect: { id: input.clientId } }
    if (input.categoryId !== undefined)
      data.category = { connect: { id: input.categoryId } }

    if (input.googleAnalyticId !== undefined)
      data.googleAnalyticId = input.googleAnalyticId
    if (input.password !== undefined) data.password = input.password
    if (input.customDomain !== undefined) data.domain = input.customDomain

    //Todo: Editing/Adding URL only for pro user
    // if (url !== undefined) data.url = url

    // TODO: use queues
    if (input.customDomain) await previsionCustomDomain(input.customDomain)

    // Finally update the category.
    return await prisma.portfolio.update({
      where: { id },
      data: {
        ...data,
        userTemplate: { connect: { id: userTemplate.id } }
      }
    })
  } catch (e) {
    logError('updatePortfolio %o', {
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
