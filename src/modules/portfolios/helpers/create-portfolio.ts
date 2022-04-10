import sendToSegment from '@extensions/segment-service/segment'
import { Context } from '@/types'
import { ApolloError } from 'apollo-server-core'
import { Portfolio } from '@/types/modules'

interface PortfolioInput {
  url: string
  description?: string
  title: string
  templateId?: string
}

export const createPortfolio = async (
  { url, description, title, templateId }: PortfolioInput,
  { prisma, user }: Context & Required<Context>
): Promise<Portfolio> => {
  if (!user) throw new ApolloError('You must be logged in.', '401')
  // Use Template or use Blank

  console.log(url, description, title, templateId)
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
  const [result, countPortfolios] = await prisma.$transaction([
    prisma.portfolio.create({
      data: {
        url,
        title,
        template: { connect: { id: userTemplate.id } },
        description,
        user: { connect: { id: user.id } }
      }
    }),

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
    eventName: 'create_new_portfolio',
    userId: user.id,
    data: {
      portfolioTitle: title,
      templateId: templateId,
      template: { ...template },
      userTemplate: { ...userTemplate },
      portfolioURL: url,
      multiple: countPortfolios > 1 ? true : false,
      portfolioCount: countPortfolios
    }
  })

  return result
}
