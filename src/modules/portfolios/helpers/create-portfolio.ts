import sendToSegment from '@extensions/segment-service/segment'
import { Portfolio } from '@/types/modules'
import { previsionCustomDomain } from '@extensions/cloudflare'

import { PrismaClient, User as DBUser } from '@prisma/client'
import { createWebsite } from '@extensions/umami'

interface PortfolioInput {
  url: string
  description?: string
  title: string
  templateId?: string
  clientId?: string
  isPremium?: boolean
  categoryId?: string
  tags?: Array<string>
  showInDirectory: boolean
  topics?: Array<string>
  shouldCustomize: boolean
  googleAnalyticId?: string
  password?: string
  customDomain?: string
}

export const createPortfolio = async (
  {
    url,
    description,
    title,
    templateId,
    clientId,
    categoryId,
    tags,
    showInDirectory,
    topics,
    isPremium,
    shouldCustomize,
    password,
    customDomain,
    googleAnalyticId
  }: PortfolioInput,
  { user, prisma }: { user: DBUser; prisma: PrismaClient }
): Promise<Portfolio> => {
  // Use Template or use Blank
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

  // Provision Analytics

  const analytics = await createWebsite({
    domain: url,
    owner: user?.umamiUserId!,
    name: `${title}-${user.username}`
  })

  const data: Record<string, unknown> = {}

  if (analytics && analytics?.websiteUuid)
    data.analyticsId = analytics.websiteUuid
  if (categoryId !== undefined) data.category = { connect: { id: categoryId } }
  if (clientId !== undefined) data.client = { connect: { id: clientId } }
  if (tags !== undefined) data.tags = tags
  if (showInDirectory !== undefined) data.showInDirectory = showInDirectory
  if (topics !== undefined) data.topics = topics
  if (googleAnalyticId !== undefined) data.googleAnalyticId = googleAnalyticId
  if (password !== undefined) data.password = password
  if (customDomain !== undefined) data.domain = customDomain

  const [result, countPortfolios] = await prisma.$transaction([
    prisma.portfolio.create({
      data: {
        url,
        title,
        isPremium,
        userTemplate: { connect: { id: userTemplate.id } },
        description,
        user: { connect: { id: user.id } },
        ...data
      },
      include: { userTemplate: true }
    }),

    prisma.portfolio.count({
      where: { userId: user.id }
    })
  ])

  // TODO: use queues
  if (customDomain) await previsionCustomDomain(customDomain)

  await sendToSegment({
    operation: 'identify',
    userId: user.id,
    data: {
      ...user
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
      hasCustomDomain: !!customDomain,
      multiple: countPortfolios > 1 ? true : false,
      portfolioCount: countPortfolios
    }
  })

  return result
}
