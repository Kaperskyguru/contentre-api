import whereContents from '@/modules/contents/helpers/where-contents'
import { useErrorParser } from '@helpers'
import { logError, logQuery } from '@helpers/logger'
import { PortfolioContent, QueryGetPortfolioContentArgs } from '@modules-types'
import { Tag } from '@prisma/client'
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
          ...where,
          visibility: 'PUBLIC',

          clientId: portfolio?.clientId! ?? undefined,
          categoryId: portfolio?.categoryId ?? undefined,

          tags: {
            path: [],
            array_contains: portfolio.tags
          }
        },
        select: { id: true }
      })

      const contents = await prisma.content.findMany({
        where: {
          ...where,
          visibility: 'PUBLIC',

          clientId: portfolio?.clientId! ?? undefined,
          categoryId: portfolio?.categoryId ?? undefined,

          tags: {
            path: [],
            array_contains: portfolio.tags
          }
        },
        include: { client: true, category: true },
        skip: skip ?? 0,
        take: size ?? undefined
      })

      // Get Public clients
      let clients: any = []
      contents.forEach((content) => {
        if (content.client) clients.push(content.client)
      })

      clients = uniq_fast(clients)

      // Get Categories
      let categories: any = []
      contents.forEach((content) => {
        if (content.category) categories.push(content.category)
      })

      categories = uniq_fast(categories)

      // Get Tags
      let tags: any = []
      contents.forEach((content) => {
        if (content.tags) tags.push(...Object.values(content.tags))
      })

      tags = tags.map((item: string, i: number) => ({
        name: item,
        id: i
      }))

      tags = uniq_fast(tags)

      // Get Tags
      let topics: any = []
      // contents.forEach((content) => {
      //   if (content.topics) topics.push(...Object.values(content.topics))
      // })

      // topics = topics.map((item: string, i: number) => ({
      //   name: item,
      //   id: i
      // }))

      // topics = uniq_fast(topics)

      return {
        contents: {
          contents,
          meta: {
            total: contentWithTotal?.id ?? 0
          }
        },
        categories,
        tags,
        topics,
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
    const topics = await prisma.topic.findMany({
      where: { teamId: user?.activeTeamId }
    })
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
      topics,
      clients
    }
  } catch (e) {
    logError('getPortfolioContent %o', e)

    const message = useErrorParser(e)
    throw new ApolloError(message, e.code ?? '500', { sentryId })
  }
}

function uniq_fast(a: any) {
  var seen: any = {}
  var out = []
  var len = a.length
  var j = 0
  for (var i = 0; i < len; i++) {
    var item = a[i].name
    if (seen[item] !== 1) {
      seen[item] = 1
      out[j++] = a[i]
    }
  }
  return out
}
