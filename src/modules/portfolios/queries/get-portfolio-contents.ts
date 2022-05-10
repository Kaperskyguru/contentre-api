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

    // Remove www from URL

    const portfolio = await prisma.portfolio.findFirst({
      where: { userId: user.id, url: filters?.url! },
      include: { template: true }
    })

    if (!portfolio) {
      throw new ApolloError('Portfolio not found', '404')
    }

    if (filters?.code) {
      const where = whereContents(user, filters)

      const contentWithTotal = await prisma.content.count({
        where: {
          ...where,
          OR: [
            { clientId: portfolio?.clientId! },
            { categoryId: portfolio.categoryId },
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
          ...where,
          OR: [
            { clientId: portfolio?.clientId! },
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
          id: portfolio?.clientId!
        }
      })
      // Get Categories
      const categories = await prisma.category.findMany({
        where: { userId: user.id, id: portfolio?.categoryId! }
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
        html: portfolio?.template?.content,
        about: user.bio,
        job: user.jobTitle,
        coverImage: '',
        profileImage: user.avatarURL,
        name: user.name,
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
      where,
      select: { id: true }
    })

    const contents = await prisma.content.findMany({
      where,
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
      html: portfolio?.template?.content,
      about: user.bio,
      job: user.jobTitle,
      coverImage: '',
      profileImage: user.avatarURL,
      name: user.name,
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
