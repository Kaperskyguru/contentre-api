import { prisma } from '@/config'
import { chunkArray, useErrorParser } from '@/helpers'
import { environment } from '@/helpers/environment'
import { logError } from '@/helpers/logger'
import { createAccount, createWebsite } from '@extensions/umami'
import { ApolloError } from 'apollo-server-errors'
import Bottleneck from 'bottleneck'

export default async (): Promise<void> => {
  try {
    // get all users
    const users = await prisma.user.findMany({})

    // Split users into group of 50 each
    const newArrays = chunkArray(users, 50)

    // New instance of Bottleneck
    const limiter = new Bottleneck({
      maxConcurrent: 1,
      minTime: 2000
    })

    const promises = newArrays.map(async (users: any) => {
      users.map(
        async (user: any) =>
          await limiter.schedule(() => processAnalytics(user))
      )
    })
    Promise.all(promises)
  } catch (error) {
    logError('sendUpdatePortfolioAnalytics %o', error)
    console.error(error)
    const message = useErrorParser(error)
    throw new ApolloError(message, error.code ?? '500', { error })
  }
}

async function processAnalytics(user: any) {
  let data = await createUmamiAccount(user)

  // Find Portfolio with User ID
  const userPortfolios = await prisma.portfolio.findMany({
    where: { userId: user.id }
  })

  userPortfolios.map(async (portfolio) => {
    await createUserWebsite(portfolio, user, data)
  })
}

async function createUmamiAccount(user: any) {
  const data = await createAccount({
    username: user.username!,
    password: environment.umami.password
  })

  await prisma.user.update({
    where: { id: user.id },
    data: {
      umamiUserId: data?.id
    }
  })

  return data
}

async function createUserWebsite(portfolio: any, user: any, data: any) {
  const website = await createWebsite({
    domain: portfolio.domain ?? portfolio.url,
    name: `${portfolio.title}-${user?.username!}`,
    owner: data?.id!
  })

  await prisma.portfolio.update({
    where: {
      id: portfolio.id
    },

    data: {
      analyticsId: website.id
    }
  })

  console.log('DONE:', user.username, portfolio.url)
}
