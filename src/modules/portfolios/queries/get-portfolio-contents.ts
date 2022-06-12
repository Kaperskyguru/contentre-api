import whereContents from '@/modules/contents/helpers/where-contents'
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

    if (!filters?.url) {
      throw new ApolloError('URL not found', '404')
    }

    const formattedURL = filters?.url.replace(/\/$/, '').trim()

    const portfolio = await prisma.portfolio.findFirst({
      where: {
        userId: user.id,
        url: { equals: formattedURL, mode: 'insensitive' }
      },
      include: { template: true }
    })

    if (!portfolio) {
      throw new ApolloError('Portfolio not found', '404')
    }

    if (filters?.code) {
      const where = whereContents(user, filters)

      const contentWithTotal = await prisma.content.count({
        where: {
          visibility: 'PUBLIC',
          ...where,
          OR: [
            { clientId: portfolio?.clientId! ?? undefined },
            { categoryId: portfolio?.categoryId ?? undefined },
            {
              tags: {
                path: [],
                array_contains: portfolio.tags
              }
            }
          ]
        },
        select: { id: true }
      })

      const contents = await prisma.content.findMany({
        where: {
          visibility: 'PUBLIC',
          ...where,
          OR: [
            { clientId: portfolio?.clientId! ?? undefined },
            { categoryId: portfolio.categoryId },
            {
              tags: {
                path: [],
                array_contains: portfolio.tags
              }
            }
          ]
        },
        include: { client: true, category: true },
        skip: skip ?? 0,
        take: size ?? undefined
      })

      // Get Public clients
      const clients = await prisma.client.findMany({
        where: {
          userId: user.id,
          visibility: 'PUBLIC',
          id: portfolio?.clientId! ?? undefined
        }
      })
      // Get Categories
      const categories = await prisma.category.findMany({
        where: { userId: user.id, id: portfolio?.categoryId! ?? undefined }
      })
      // Get Topics
      // const topics = await prisma.topic.findMany({
      //   where: { userId: user?.id }
      // })
      // Get Tags
      const tags = await prisma.tag.findMany({
        where: {
          userId: user?.id,
          AND: {
            name: {
              in: portfolio.tags?.toString().split(' '),
              mode: 'insensitive'
            }
          }
        }
      })

      return {
        contents: {
          contents,
          meta: {
            total: contentWithTotal?.id ?? 0
          }
        },
        categories,
        tags,
        clients
      }
    }

    // Select Contents
    const where = whereContents(user, filters)

    const contentWithTotal = await prisma.content.count({
      where: { ...where, visibility: 'PUBLIC' },
      select: { id: true }
    })

    const contents = await prisma.content.findMany({
      where: { ...where, visibility: 'PUBLIC' },
      include: { client: true, category: true },
      skip: skip ?? 0,
      take: size ?? undefined
    })

    // Get Public clients
    const clients = await prisma.client.findMany({
      where: { userId: user.id, visibility: 'PUBLIC' }
    })
    // Get Categories
    const categories = await prisma.category.findMany({
      where: { userId: user.id }
    })
    // Get Topics
    // const topics = await prisma.topic.findMany({
    //   where: { userId: user?.id }
    // })
    // Get Tags
    const tags = await prisma.tag.findMany({
      where: { userId: user?.id }
    })

    return {
      contents: {
        contents,
        meta: {
          total: contentWithTotal?.id ?? 0
        }
      },
      categories,
      tags,
      clients
    }
  } catch (e) {
    logError('getPortfolioContent %o', e)

    const message = useErrorParser(e)
    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}
