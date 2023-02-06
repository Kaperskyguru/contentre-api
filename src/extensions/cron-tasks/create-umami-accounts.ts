import { prisma } from '@/config'
import { useErrorParser } from '@/helpers'
import { logError } from '@/helpers/logger'
import { createAccount, createWebsite } from '@extensions/umami'
import { ApolloError } from 'apollo-server-errors'

export default async (): Promise<void> => {
  try {
    // get all users
    const users = await prisma.user.findMany({})

    const promises = users.map(async (user) => {
      let data: any = {}
      if (user.analyticsId && user.umamiUserId) {
        data.accountUuid = user.analyticsId
        data.id = user.umamiUserId
      } else {
        data = await createAccount({
          username: user.username!,
          password: 'Password11!'
        })

        await prisma.user.update({
          where: { id: user.id },
          data: {
            analyticsId: data.accountUuid,
            umamiUserId: data.id
          }
        })
      }

      // Find Portfolio with User ID
      const userPortfolios = await prisma.portfolio.findMany({
        where: { userId: user.id, analyticsId: null }
      })

      userPortfolios.map(async (portfolio) => {
        const website = await createWebsite({
          domain: portfolio.domain ?? portfolio.url,
          name: `${portfolio.title}-${user.username}`,
          owner: data?.id!
        })

        await prisma.portfolio.update({
          where: {
            id: portfolio.id
          },

          data: {
            analyticsId: website.websiteUuid
          }
        })
      })
    })

    await Promise.all(promises)
  } catch (error) {
    logError('sendUpdatePortfolioAnalytics %o', error)
    console.error(error)
    const message = useErrorParser(error)
    throw new ApolloError(message, error.code ?? '500', { error })
  }
}
