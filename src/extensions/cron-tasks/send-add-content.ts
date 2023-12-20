import { chunkArray, useErrorParser } from '@/helpers'
import { prisma } from '@/config'
import { logError } from '@/helpers/logger'
import sendMailjetEmail from '@extensions/mail-service/send-mailjet-email'
import { ApolloError } from 'apollo-server-errors'
import Bottleneck from 'bottleneck'

export default async (): Promise<void> => {
  // get all users without added content

  try {
    const users = await prisma.user.findMany({
      where: { contents: { none: {} } },
      select: { email: true, username: true, name: true }
    })

    const messageData = users.map((user) => ({
      to: user.email,
      username: user.username,
      name: user.name,
      variables: {
        NAME: user.name,
        USERNAME: user.username
      }
    }))

    // Split users into group of 50 each
    const newArrays = chunkArray(messageData, 50)

    // New instance of Bottleneck
    const limiter = new Bottleneck({
      maxConcurrent: 1,
      minTime: 28800000 // 8 hours
    })

    // Use Bottleneck to process mails. Please don't await the Promise.all
    Promise.all(
      newArrays.map(
        async (message: any) =>
          await limiter.schedule(() => processMail(message))
      )
    )
  } catch (error) {
    logError('sendAddContent %o', error)
    console.error(error)
    const message = useErrorParser(error)
    throw new ApolloError(message, error.code ?? '500', { error })
  }
}

async function processMail(message: any) {
  return await sendMailjetEmail(
    {
      templateId: '4371325',
      data: message,
      subject: "What's the #1 thing you need in your portfolio?"
    },
    true
  )
}
