import { chunkArray, delay, useErrorParser } from '@/helpers'
import { prisma } from '@/config'
import { logError } from '@/helpers/logger'
import sendMailjetEmail from '@extensions/mail-service/send-mailjet-email'
import { ApolloError } from 'apollo-server-errors'
import { User } from '@/types/modules'
import { endOfMonth, startOfMonth } from 'date-fns'

export default async (): Promise<void> => {
  try {
    // get all users
    const users = await prisma.user.findMany({})
    const contents = await prisma.content.groupBy({
      by: ['userId'],
      _count: {
        userId: true
      },
      orderBy: {
        _count: {
          userId: 'desc'
        }
      },

      where: {
        notebookId: null,
        createdAt: {
          gte: startOfMonth(new Date()),
          lt: endOfMonth(new Date())
        }
      }
    })

    const clients = await prisma.client.groupBy({
      by: ['userId'],
      _count: {
        userId: true
      },
      orderBy: {
        _count: {
          userId: 'desc'
        }
      },

      where: {
        createdAt: {
          gte: startOfMonth(new Date()),
          lt: endOfMonth(new Date())
        }
      }
    })

    const category = await prisma.category.groupBy({
      by: ['userId'],
      _count: {
        userId: true
      },
      orderBy: {
        _count: {
          userId: 'desc'
        }
      },

      where: {
        createdAt: {
          gte: startOfMonth(new Date()),
          lt: endOfMonth(new Date())
        }
      }
    })

    const topic = await prisma.topic.groupBy({
      by: ['teamId'],
      _count: {
        teamId: true
      },
      orderBy: {
        _count: {
          teamId: 'desc'
        }
      },

      where: {
        createdAt: {
          gte: startOfMonth(new Date()),
          lt: endOfMonth(new Date())
        }
      }
    })

    const tag = await prisma.tag.groupBy({
      by: ['userId'],
      _count: {
        userId: true
      },
      orderBy: {
        _count: {
          userId: 'desc'
        }
      },

      where: {
        createdAt: {
          gte: startOfMonth(new Date()),
          lt: endOfMonth(new Date())
        }
      }
    })

    const contentGreaterThanAllUsers = await calculateContentPercentGreater(
      contents,
      users
    )

    const clientGreaterThanAllUsers = await calculateClientPercentGreater(
      clients,
      users
    )

    const grouping = sumGrouping({
      tag,
      category,
      topic,
      users
    })
    const groupingGreaterThanAllUsers = await calculateGroupingPercentGreater(
      grouping
    )

    const messageData = users.map((user) => {
      const totalGrouping = calculateGrouping({
        category,
        topic,
        tag,
        user
      })

      const greaterStr = contentGreaterThanAllUsers.find(
        (item) => item.email === user.email
      )?.percent

      const clientGreaterStr = clientGreaterThanAllUsers.find(
        (item) => item.email === user.email
      )?.percent

      const groupingGreaterStr = groupingGreaterThanAllUsers.find(
        (item) => item.email === user.email
      )?.percent

      const totalContents = contents.find((item) => item.userId === user.id)
        ?._count.userId

      const totalClients = clients.find((item) => item.userId === user.id)
        ?._count.userId

      return {
        to: user.email,
        username: user.username,
        name: user.name,
        variables: {
          totalNumberOfContent: totalContents ?? 0,
          totalNumberOfGroupings: totalGrouping ?? 0,
          totalNumberOfClient: totalClients ?? 0,
          contentGreaterThanAllUsers: greaterStr ?? 0,
          clientGreaterThanAllUsers: clientGreaterStr ?? 0,
          groupingGreaterThanAllUsers: groupingGreaterStr ?? 0,
          totalContentIncrease: '0',
          totalClientIncrease: '0',
          totalGroupingsIncrease: '0',
          totaltraffic: '0',
          totalTrafficIncrease: '0',
          totalPageViews: '0',
          totalPageViewsIncrease: '0',
          totalPortfolioUsers: '0',
          totalPortfolioUsersIncrease: '0',
          trafficGreaterThanAllUsers: 0,
          viewsGreaterThanAllUsers: 0,
          usersGreaterThanAllUsers: 0
        }
      }
    })

    //TODO: Use queues
    const chunkValue = Math.floor(messageData.length / 4.4)
    const newArrays = chunkArray(messageData, chunkValue)

    await Promise.all(
      newArrays.map(async (message: any) => {
        const res = await sendMailjetEmail(
          {
            templateId: '4374011',
            data: message,
            subject: 'Your Contentre Analytics'
          },
          true
        )
        await delay(10000)
      })
    )
  } catch (error) {
    logError('sendAddContent %o', error)
    console.error(error)
    const message = useErrorParser(error)
    throw new ApolloError(message, error.code ?? '500', { error })
  }
}

async function calculateContentPercentGreater(
  contents: Array<any>,
  users: Array<User>
) {
  const filteredUsers = findByIds(users, [
    ...contents.map((i) => ({ id: i.userId }.id))
  ])

  const totalContent = contents.reduce((acc, a) => {
    return acc + a._count.userId
  }, 0)

  return contents.map((content, index) => ({
    email: filteredUsers.find((user) => user.id === content.userId)?.email,
    percent: Math.round((content._count.userId / totalContent) * 100)
  }))
}

async function calculateClientPercentGreater(
  clients: Array<any>,
  users: Array<User>
) {
  const filteredUsers = findByIds(users, [
    ...clients.map((i) => ({ id: i.userId }.id))
  ])

  const totalClient = clients.reduce((acc, a) => {
    return acc + a._count.userId
  }, 0)

  return clients.map((client, index) => ({
    email: filteredUsers.find((user) => user.id === client.userId)?.email,
    percent: Math.round((client._count.userId / totalClient) * 100)
  }))
}

async function calculateGroupingPercentGreater(groupings: Array<any>) {
  const totalGrouping = groupings.reduce((acc, a) => {
    return acc + a.count
  }, 0)

  return groupings.map((group, index) => ({
    email: group.email,
    percent: Math.round((group.count / totalGrouping) * 100)
  }))
}

function findByIds(data: Array<any>, ids: Array<string>) {
  return data.filter((item) => ids.includes(item.id))
}

function findByTeamIds(data: Array<any>, ids: Array<string>) {
  return data.filter((item) => ids.includes(item.activeTeamId))
}

function sumGrouping({
  category,
  tag,
  topic,
  users
}: {
  category: Array<any>
  tag: Array<any>
  topic: Array<any>
  users: Array<User>
}) {
  const filteredCategoryUsers = findByIds(users, [
    ...category.map((i) => ({ id: i.userId }.id))
  ])

  const filteredTagUsers = findByIds(users, [
    ...tag.map((i) => ({ id: i.userId }.id))
  ])

  const filteredTopicUsers = findByTeamIds(users, [
    ...topic.map((i) => ({ id: i.teamId }.id))
  ])

  // Calculate total categories
  const categoriesCount = category.map((category) => ({
    email: filteredCategoryUsers.find((user) => user.id === category.userId)
      ?.email,
    count: category._count.userId
  }))

  const tagsCount = tag.map((tag) => ({
    email: filteredTagUsers.find((user) => user.id === tag.userId)?.email,
    count: tag._count.userId
  }))

  const topicsCount = topic.map((topic) => ({
    email: filteredTopicUsers.find((user) => user.activeTeamId === topic.teamId)
      ?.email,
    count: topic._count.teamId
  }))

  return [...categoriesCount, ...tagsCount, ...topicsCount]
    .reduce((acc: any, e) => {
      const found = acc.find((x: any) => e.email === x.email)
      found ? (found.count += e.count) : acc.push(e)
      return acc
    }, [])
    .sort((a: any, b: any) => b.count - a.count)
}

function calculateGrouping({
  category,
  tag,
  topic,
  user
}: {
  category: Array<any>
  tag: Array<any>
  topic: Array<any>
  user: User
}) {
  const total = category.find((item) => item.userId === user.id)?._count.userId
  const totalNiche = topic.find((item) => item.teamId === user.activeTeamId)
    ?._count.teamId
  const totalTag = tag.find((item) => item.userId === user.id)?._count.userId

  return (total! ?? 0) + (totalNiche! ?? 0) + (totalTag! ?? 0)
}
