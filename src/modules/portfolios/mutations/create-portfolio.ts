import { useErrorParser } from '@/helpers'
import { logError, logMutation } from '@/helpers/logger'
import { Context } from '@/types'
import { Portfolio, MutationCreatePortfolioArgs } from '@/types/modules'
import { ApolloError } from 'apollo-server-core'

export default async (
  _parent: unknown,
  { input }: MutationCreatePortfolioArgs,
  context: Context & Required<Context>
): Promise<Portfolio> => {
  const { prisma, user, ipAddress, requestURL, sentryId } = context
  logMutation('createPortfolio %o', {
    input,
    user,
    ipAddress,
    requestURL
  })
  try {
    if (!user) throw new ApolloError('You must be logged in.', '401')

    const { url, description, title, templateId } = input

    // Use Template or use Blank
    let template
    if (templateId !== undefined) {
      template = await prisma.template.findUnique({
        where: { id: templateId! }
      })
    } else
      template = await prisma.template.findFirst({
        where: { title: { equals: 'BLANK', mode: 'insensitive' } }
      })

    // Create UserTemplate incase of editing
    const userTemplate = await prisma.userTemplate.create({
      data: {
        template: { connect: { id: template?.id } },
        content: template?.content!
      }
    })

    const newPortfolio = await prisma.portfolio.create({
      data: {
        url,
        title,
        template: { connect: { id: userTemplate.id } },
        description,
        user: { connect: { id: user.id } }
      }
    })

    return newPortfolio
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
